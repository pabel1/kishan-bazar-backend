// external import
const express = require("express");
const { createVisitor, getAllVisitor } = require("../controllers/visitorController");

// creating router
const router = express.Router();

router.route("/visitor/create").post(createVisitor);
router.route("/visitor/all").get(getAllVisitor);

module.exports = router;
