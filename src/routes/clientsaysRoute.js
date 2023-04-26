// external import
const express = require("express");

// internal import
const { isAuthenticatedUser, authorizeRoles } = require("../auth/auth");
const {
  createClient,
  getAllClient,
  deleteClient,
  updateClient,
} = require("../controllers/clientsaysController");

// creating router
const router = express.Router();

router
  .route("/clientsays/create")
  .post(isAuthenticatedUser, authorizeRoles("Admin"), createClient);
router.route("/clientsays/all").get(getAllClient);
router
  .route("/clientsays/update/:id")
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateClient);
router
  .route("/clientsays/delete/:id")
  .delete(isAuthenticatedUser, authorizeRoles("Admin"), deleteClient);

module.exports = router;
