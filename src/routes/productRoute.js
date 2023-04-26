// external import
const express = require("express");

// internal import
const {
  createSingleProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getSingleProduct,
  uploadProducts,
  getAllSubCategory,
  getAllProductsByCategorySub,
  getAllProductsByCategorySubTesting,
  getAllProductsBySearching,
  getAllProductsPagination,
  getAllCategoriesAndSubCategories,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");

// creating router
const router = express.Router();

router
  .route("/product/create/single")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createSingleProduct);
router
  .route("/products/uploadfile")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), uploadProducts);
router.route("/product/all").get(getAllProducts);
router.route("/product/categories/subcategories").get(getAllCategoriesAndSubCategories);
router.route("/productpagination/all/:page/:limit").get(getAllProductsPagination);
router
  .route("/product/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateProduct);
router
  .route("/product/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteProduct);
router.route("/product/:id").get(getSingleProduct);
router.route("/getsubcategory/:category").get(getAllSubCategory);
router.get(
  "/getproductsbycategory/:page/:limit/:category/:subcategory",
  getAllProductsByCategorySub
);
router.get(
  "/getproductsbycategorysorting/:page/:limit/:category/:subcategory/:sort",
  getAllProductsByCategorySubTesting
);
router.get("/productbysearch/:page/:limit/:search", getAllProductsBySearching);
module.exports = router;
