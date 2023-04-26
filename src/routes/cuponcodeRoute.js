// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const {
  createCupon,
  deleteCupon,
  getAllCupon,
  updateCupon,
  getACupon,
} = require("../controllers/cuponcodeController");

// creating router
const router = express.Router();

router
  .route("/cuponcode/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createCupon);
router
  .route("/cuponcode/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteCupon);
router
  .route("/cuponcode/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateCupon);

router
  .route("/cuponcode/getall")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllCupon);

router.route("/cuponcode/get/:cupon").get(getACupon);

module.exports = router;
