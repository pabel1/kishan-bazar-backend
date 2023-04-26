const catchAsyncError = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Errorhandeler = require("../utility/ErrorHandler");
const pdf = require("html-pdf");
const pdfTemplate = require("../documents");
const path = require("path");

// Creating new order
exports.createNewOrder = catchAsyncError(async (req, res, next) => {
  const { shippingInfo, paymentInfo, orderItems, orderId } = req.body;

  const order = await Order.create({
    shippingInfo,
    paymentInfo,
    orderItems,
    paidAt: Date.now(),
    user: req.user._id,
    orderId,
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order: order,
  });
});

// Get all order
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new Errorhandeler("No Orders found", 404));
  }
  res.status(200).json({
    success: true,
    orders: orders,
  });
});

exports.getAllOrdersPagination = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.params.page) || 1;
  let perpage = Number(req.params.limit) || 10;

  let skipRow = (pageno - 1) * perpage;
  const orders = await Order.find().skip(skipRow).limit(perpage);
  if (!orders) {
    return next(new Errorhandeler("No Orders found", 404));
  }
  res.status(200).json({
    success: true,
    orders: orders,
  });
});

// Get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(new Errorhandeler("Order not found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// update order staus --admin
exports.updateOrderStatus = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new Errorhandeler("Order not found with this id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(
      new Errorhandeler("You have already delivered this order", 400)
    );
  }

  if (req.body.status === "Shipped") {
    order.orderItems.forEach(
      async (item) => await updataStock(item.productId, item.quantity)
    );
  }

  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.status(200).json({
    success: true,
    message: "Status Updated Successfully",
  });
});

// for updating the product stock
async function updataStock(id, quantity) {
  const product = await Product.findById(id);
  if(product)
  {
    if (product.stock > 0) {
    product.stock -= quantity;
    await product.save();
  }
  }
  
}

// delete order --admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new Errorhandeler("Order not found with this id", 404));
  }
  await order.remove();
  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});

// get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

// create order invoice
exports.createInvoice = catchAsyncError(async (req, res, next) => {
  console.log(req.body);
  pdf
    .create(pdfTemplate(req.body), {})
    .toFile(`${__dirname}/../documents/invoice.pdf`, (err) => {
      if (err) {
        res.send(Promise.reject());
      }
      res.send(Promise.resolve());
    });
});

// fetch invoice
exports.fetchInvoice = catchAsyncError((req, res, next) => {
  res.sendFile(path.join(__dirname, "../documents/invoice.pdf"));
});
