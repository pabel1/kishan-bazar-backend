// external import
const express = require("express");

// internal import
const {
  signupUser,
  loginUser,
  logoutUser,
  myDetails,
  updateMyPassword,
  updateMyProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");

// creating router
const router = express.Router();

router.route("/signup").post(signupUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/forgot/password").post(forgotPassword);
router.route("/user/password/reset/:token").post(resetPassword);

router.route("/myprofile").get(isAuthenticatedUser, myDetails);
router.route("/update/mypassword").put(isAuthenticatedUser, updateMyPassword);
router.route("/update/myprofile").put(isAuthenticatedUser, updateMyProfile);
// router
//   .route("/allusers")
//   .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllUsers);
router
  .route("/allusers/:page/:limit")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllUsers);
router
  .route("/singleuser/:id")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getSingleUser);
router
  .route("/updaterole/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateUserRole);
router
  .route("/deleteuser/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteUser);

module.exports = router;
