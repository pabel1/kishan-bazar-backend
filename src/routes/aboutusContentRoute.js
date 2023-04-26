// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const { createAboutUs, getAllAboutusData, updateAboutus, deleteAboutUs } = require("../controllers/aboutUsContentCintroller");


// creating router
const router = express.Router();

router
  .route("/aboutus/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"),createAboutUs);
router.route("/aboutus/all").get(getAllAboutusData);
router
  .route("/aboutus/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateAboutus);
router
  .route("/aboutus/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteAboutUs);

module.exports = router;
