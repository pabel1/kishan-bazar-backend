// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const {
  createShipping,
  getAllShipping,
  UpdateShipping,
  deleteShipping,
} = require("../controllers/shippingController");

// creating router
const router = express.Router();

router
  .route("/shippingcost/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createShipping);

router
  .route("/shippingcost/getall")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllShipping);

router
  .route("/shippingcost/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), UpdateShipping);

router
  .route("/shippingcost/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteShipping);

module.exports = router;
