// external import
const express = require("express");

// internal import

const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const {
  createNewOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  deleteOrder,
  myOrders,
  createInvoice,
  fetchInvoice,
  getAllOrdersPagination,
} = require("../controllers/orderController");

// creating router
const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, createNewOrder);
router
  .route("/order/all/:page/:limit")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllOrdersPagination);
router
  .route("/order/all")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllOrders);

router.route("/order/my").get(isAuthenticatedUser, myOrders);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router
  .route("/order/updatestatus/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateOrderStatus);
router
  .route("/order/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteOrder);

router.route("/create/invoice").post(isAuthenticatedUser, createInvoice);
router.route("/fetch/invoicepdf").get(isAuthenticatedUser, fetchInvoice);
module.exports = router;
