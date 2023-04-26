// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const { createCampaign, getAllCampaigns, deleteCampaign, updateCampaign } = require("../controllers/campaignController");

// creating router
const router = express.Router();

router
  .route("/campaign/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createCampaign);
router.route("/campaign/all").get(getAllCampaigns);
// router.route("/campaign/all/:page/:limit").get(getAllCampaigns);
router.route("/update/:id").put(isAuthenticatedUser, authorizeRoles("Admin"),updateCampaign);
router.route("/delete/:id").delete(isAuthenticatedUser, authorizeRoles("Admin"),deleteCampaign);

module.exports = router;
