const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verfiyToken");
const {
  createInventoryController,
  getInventoryController,
  getDonrsController,
  getHospitalsController,
  getOrganisationsController,
  getOrganisationsHospitalsController,
  createInventoryHospitalController,
  getRecentInventoryController,
} = require("../controller/inventoryController");

router.post("/createInventory", verifyToken, createInventoryController);
router.get("/getInventory", verifyToken, getInventoryController);
router.get("/get-recent-inventory", verifyToken, getRecentInventoryController);
router.post(
  "/createInventoryHospital",
  verifyToken,
  createInventoryHospitalController
);
router.get("/getDonars", verifyToken, getDonrsController);
router.get("/getHospitals", verifyToken, getHospitalsController);
router.get("/getOrganisations", verifyToken, getOrganisationsController);
router.get(
  "/getOrganisationsHospitals",
  verifyToken,
  getOrganisationsHospitalsController
);

module.exports = router;
