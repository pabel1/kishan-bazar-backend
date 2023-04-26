const catchAsyncError = require("../middlewares/catchAsyncError");
const csv = require("csvtojson");
const ErrorHandler = require("../utility/ErrorHandler");
const path = require("path");
const { match } = require("assert");
const DiscountProductModel = require("../models/discountProductModel");

// Create new discount product -- ADMIN
exports.createDiscountSingleProduct = catchAsyncError(
  async (req, res, next) => {
    const {
      productId,
      productname,
      description,
      price,
      discountInPercent,
      brand,
      image,
      category,
      subcategory,
      stock,
    } = req.body;
    if (
      !productId ||
      !productname ||
      !description ||
      !price ||
      !discountInPercent ||
      !brand ||
      !image ||
      !category ||
      !subcategory ||
      !stock
    ) {
      return next(new ErrorHandler("Please fill the value", 400));
    }
    req.body.user = req.user._id;
    const productExist = await Product.findOne({ productId: productId });
    if (productExist) {
      return next(
        new ErrorHandler("Product Already Exist is the database", 409)
      );
    }
    let discountPrice = (parseInt(price) * parseInt(discountInPercent)) / 100;
    const product = await DiscountProductModel.create({
      productId,
      productname,
      description,
      price,
      discountInPercent,
      discountPrice,
      brand,
      image,
      category,
      subcategory,
      stock,
    });
    res.status(201).json({
      success: true,
      message: "Discount Product created successfully",
      product: product,
    });
  }
);

// Create multiple products -- ADMIN
exports.uploadDiscountProducts = catchAsyncError(async (req, res, next) => {
  if (req.files === null) {
    return next(new ErrorHandler("No file Uploaded", 400));
  }
  const file = req.files.csvfile;
  const replacedfilename = file.name.replace(
    file.name.split(".")[0],
    "discounts"
  );
  file.mv(`${__dirname}/../uploads/${replacedfilename}`, (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorHandler(err.message, 500));
    }
  });
  const jsonObject = await csv().fromFile(
    `${__dirname}/../uploads/discounts.csv`
  );
  var isOK = true;
  const allproducts = await DiscountProductModel.find();
  jsonObject.forEach((obj) => {
    const productExist = allproducts.find(
      (value) => value.productId === obj.productId
    );
    if (productExist) {
      isOK = false;
    }
  });
  if (!isOK) {
    return next(new ErrorHandler("Product Already Exist is the database", 409));
  } else {
    jsonObject.forEach((product) => {
      product.price = parseInt(product.price);
      product.stock = parseInt(product.stock);
      product.discountPrice =
        (parseInt(product.price) * parseInt(product.discountInPercent)) / 100;
    });
    const products = await DiscountProductModel.create(jsonObject);
    res.status(200).json({
      success: true,
      message: "Discount Products Uploaded Successfully",
      products,
    });
  }
});

// Get all products
exports.getAllDiscountProducts = catchAsyncError(async (req, res, next) => {
  const products = await DiscountProductModel.find();
  res.status(200).json({
    success: true,
    message: "Product gets successfully",
    products: products,
  });
});

exports.getAllDiscountProductsPagination = catchAsyncError(
  async (req, res, next) => {
    let pageno = Number(req.params.page) || 1;
    let perpage = Number(req.params.limit) || 10;

    let skipRow = (pageno - 1) * perpage;
    const products = await DiscountProductModel.find()
      .skip(skipRow)
      .limit(perpage);
    const totalProducts = await DiscountProductModel.find().countDocuments();
    res.status(200).json({
      success: true,
      message: "Product gets successfully",
      products,
      totalProducts,
    });
  }
);

// query filter
exports.getAllDiscountProductsByCategory = catchAsyncError(
  async (req, res, next) => {
    let pageno = Number(req.params.page) || 1;
    let perpage = Number(req.params.limit) || 10;

    let sortValue = Number(req.params.sort) || 0;
    let categoryValue = req.params.category || 0;
    let skipRow = (pageno - 1) * perpage;
    let resData;

    if (sortValue !== 0) {
      if (categoryValue === "All") {
        resData = await DiscountProductModel.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
              blogData: [
                { $skip: skipRow },
                { $limit: perpage },
                { $sort: { price: sortValue } },
              ],
            },
          },
        ]);
      } else {
        resData = await DiscountProductModel.aggregate([
          {
            $facet: {
              total: [
                { $match: { category: { $eq: categoryValue } } },
                { $count: "count" },
              ],
              blogData: [
                { $match: { category: { $eq: categoryValue } } },
                { $skip: skipRow },
                { $limit: perpage },
                { $sort: { price: sortValue } },
              ],
            },
          },
        ]);
      }
    } else {
      if (categoryValue === "All") {
        resData = await DiscountProductModel.aggregate([
          {
            $facet: {
              total: [{ $count: "count" }],
              blogData: [{ $skip: skipRow }, { $limit: perpage }],
            },
          },
        ]);
      } else {
        resData = await DiscountProductModel.aggregate([
          {
            $facet: {
              total: [
                { $match: { category: { $eq: categoryValue } } },
                { $count: "count" },
              ],
              blogData: [
                { $match: { category: { $eq: categoryValue } } },
                { $skip: skipRow },
                { $limit: perpage },
              ],
            },
          },
        ]);
      }
    }
    res.status(200).json({
      success: true,
      message: "Product gets successfully",
      resData,
    });
  }
);

// get subCategory
exports.getAllDiscountCategory = catchAsyncError(async (req, res, next) => {
  try {
    // let categoryValue = req.params.category;
    const resData = await DiscountProductModel.aggregate([
      //   { $match: { category: { $eq: categoryValue } } },
      { $group: { _id: "$category" } },
    ]);
    // console.log(res)
    res.status(200).json({
      status: "success",
      resData,
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// Update Product --ADMIN
exports.updateDiscountProduct = catchAsyncError(async (req, res, next) => {
  const {
    productId,
    productname,
    description,
    price,
    brand,
    image,
    category,
    subcategory,
    stock,
    discountInPercent,
  } = req.body;
  if (
    !productId &&
    !productname &&
    !description &&
    !price &&
    !brand &&
    !image &&
    !category &&
    !subcategory &&
    !discountInPercent
  ) {
    return next(new ErrorHandler("Please fill the value", 400));
  }
  let product = await DiscountProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Discount Product not found", 404));
  }
  discountPrice = (parseInt(price) * parseInt(discountInPercent)) / 100;
  product = await DiscountProductModel.findByIdAndUpdate(
    req.params.id,
    {
      productId,
      productname,
      description,
      price,
      brand,
      image,
      category,
      subcategory,
      stock,
      discountInPercent,
      discountPrice,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Discount Product Updated Successfully",
    product: product,
  });
});

// Delete Product (--ADMIN)
exports.deleteDiscountProduct = catchAsyncError(async (req, res, next) => {
  const product = await DiscountProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully!!",
    product: product,
  });
});

// Get single product
exports.getSingleDiscountProduct = catchAsyncError(async (req, res, next) => {
  const product = await DiscountProductModel.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product get successfully",
    product: product,
  });
});
