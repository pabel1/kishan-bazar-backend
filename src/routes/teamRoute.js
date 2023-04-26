// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const {
  createTeam,
  getAllTeamMembers,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");

// creating router
const router = express.Router();

router
  .route("/teammember/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createTeam);
router.route("/teammember/all").get(getAllTeamMembers);
router
  .route("/teammember/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateTeamMember);
router
  .route("/teammember/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteTeamMember);

module.exports = router;
