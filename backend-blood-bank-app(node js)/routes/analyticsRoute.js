const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verfiyToken");
const {
  bloodGroupDetailsContoller,
} = require("../controller/analyticsController");

router.get("/bloodGroupData", verifyToken,bloodGroupDetailsContoller);
module.exports = router;