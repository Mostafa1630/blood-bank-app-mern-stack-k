const User = require("../models/authModel");
const asynchandler = require("express-async-handler");

//GET DONAR LIST
const getDonarsListController = asynchandler(async (req, res) => {
  const donarData = await User.find({ role: "donar" }).sort({ createdAt: -1 });

  return res.status(200).send({
    success: true,
    Toatlcount: donarData.length,
    message: "Donar List Fetched Successfully",
    donarData,
  });
});
//GET HOSPITAL LIST
const getHospitalListController = asynchandler(async (req, res) => {
  const hospitalData = await User.find({ role: "hospital" }).sort({
    createdAt: -1,
  });

  return res.status(200).send({
    success: true,
    Toatlcount: hospitalData.length,
    message: "HOSPITAL List Fetched Successfully",
    hospitalData,
  });
});
//GET ORG LIST
const getOrgListController = asynchandler(async (req, res) => {
  const orgData = await User.find({ role: "organisation" }).sort({
    createdAt: -1,
  });

  return res.status(200).send({
    success: true,
    Toatlcount: orgData.length,
    message: "ORG List Fetched Successfully",
    orgData,
  });
});
// =======================================

//DELETE DONAR
const deleteDonarController = asynchandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).send({
    success: true,
    message: " Record Deleted successfully",
  });
});

//EXPORT
module.exports = {
  getDonarsListController,
  getHospitalListController,
  getOrgListController,
  deleteDonarController,
};
