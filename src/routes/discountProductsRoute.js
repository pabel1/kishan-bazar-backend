// external import
const express = require("express");

// internal import
const {
  getAllDiscountProducts,
  uploadDiscountProducts,
  getAllDiscountProductsByCategory,
  getAllDiscountCategory,
  updateDiscountProduct,
  deleteDiscountProduct,
  getSingleDiscountProduct,
  createDiscountSingleProduct,
  getAllDiscountProductsPagination,
} = require("../controllers/discountProductController");
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");

// creating router
const router = express.Router();

router
  .route("/discountproducts/create")
  .post(
    isAuthenticatedUser,
    authorizeRoles("Admin"),
    createDiscountSingleProduct
  );
router
  .route("/discountproducts/uploadfile")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), uploadDiscountProducts);
router.route("/discountproducts/all").get(getAllDiscountProducts);
router.route("/discountproducts/all/:page/:limit").get(getAllDiscountProductsPagination);
router
  .route("/discountproducts/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateDiscountProduct);
router
  .route("/discountproducts/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteDiscountProduct);

router.route("/discountproducts/:id").get(getSingleDiscountProduct);
router.route("/discountproductscategory").get(getAllDiscountCategory);
router.get(
  "/discountproductsbycategory/:page/:limit/:category/:sort",
  getAllDiscountProductsByCategory
);
module.exports = router;
