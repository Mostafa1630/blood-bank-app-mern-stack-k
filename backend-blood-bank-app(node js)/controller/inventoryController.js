const asynchandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Inventory = require("../models/inventoryModel");
const User = require("../models/authModel");

const createInventoryController = asynchandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new ApiError("user not found", 400));
  }

  // if (req.body.inventoryType === "in" && user.role !== "donar") {
  //   return next(new ApiError("Not a donar acount", 400));
  // }

  // if (req.body.inventoryType === "out" && user.role !== "hospital") {
  //   return next(new ApiError("Not a hospital", 400));
  // }

  if (req.body.inventoryType == "out") {
    const requestedBloodGroup = req.body.bloodGroup;
    const requestedQuantityOfBlood = req.body.quantity;
    const organisation = new mongoose.Types.ObjectId(req.body.userId);
    //calculate Blood Quanitity
    const totalInOfRequestedBlood = await Inventory.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "in",
          bloodGroup: requestedBloodGroup,
        },
      },
      {
        $group: {
          _id: "$bloodGroup",
          total: { $sum: "$quantity" },
        },
      },
    ]);
    // console.log("Total In", totalInOfRequestedBlood);
    const totalIn = totalInOfRequestedBlood[0]?.total || 0;
    //calculate OUT Blood Quanitity

    const totalOutOfRequestedBloodGroup = await Inventory.aggregate([
      {
        $match: {
          organisation,
          inventoryType: "out",
          bloodGroup: requestedBloodGroup,
        },
      },
      {
        $group: {
          _id: "$bloodGroup",
          total: { $sum: "$quantity" },
        },
      },
    ]);
    const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

    //in & Out Calc
    const availableQuanityOfBloodGroup = totalIn - totalOut;
    //quantity validation
    if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
      return res.status(500).json({
        success: false,
        message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
      });
    }
    req.body.hospital = user?._id;
  } else {
    req.body.donar = user?._id;
  }

  const inventory = new Inventory(req.body);
  await inventory.save();

  res.status(201).json({
    status: "success",
    message: "new blood record added successfully",
    data: { inventory },
  });
});

const getInventoryController = asynchandler(async (req, res, next) => {
  const inventorys = await Inventory.find({ orgnisation: req.user._id })
    .populate("donar")
    .populate("hospital")
    .sort({
      createdAt: -1,
    });
  if (!inventorys) {
    return next(new ApiError("Not Found inventorys", 400));
  }
  res.status(201).json({
    result: inventorys.length,
    data: { inventorys },
  });
});

const createInventoryHospitalController = asynchandler(
  async (req, res, next) => {
    const inventory = await Inventory.find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      messaage: "get hospital comsumer records successfully",
      inventory,
    });
  }
);

const getDonrsController = asynchandler(async (req, res, next) => {
  const organisation = req.body.userId;
  //find donars
  const donorId = await Inventory.distinct("donar", {
    organisation,
  });
  // console.log(donorId);
  const donars = await User.find({ _id: { $in: donorId } });

  return res.status(200).json({
    success: true,
    message: "Donar Record Fetched Successfully",
    donars,
  });
});

const getHospitalsController = asynchandler(async (req, res, next) => {
  const organisation = req.body.userId;
  //GET HOSPITAL ID
  const hospitalId = await Inventory.distinct("hospital", {
    organisation,
  });
  //FIND HOSPITAL
  const hospitals = await User.find({
    _id: { $in: hospitalId },
  });
  return res.status(200).json({
    success: true,
    message: "Hospitals Data Fetched Successfully",
    hospitals,
  });
});

const getOrganisationsController = asynchandler(async (req, res, next) => {
  const donar = req.body.userId;
  const orgId = await Inventory.distinct("organisation", { donar });
  //find org
  const organisations = await User.find({
    _id: { $in: orgId },
  });
  return res.status(200).json({
    success: true,
    message: "Org Data Fetched Successfully",
    organisations,
  });
});

const getOrganisationsHospitalsController = asynchandler(
  async (req, res, next) => {
    const hospital = req.body.userId;
    const orgId = await Inventory.distinct("organisation", { hospital });
    //find org
    const organisations = await User.find({
      _id: { $in: orgId },
    });
    return res.status(200).json({
      success: true,
      message: "Hospital Org Data Fetched Successfully",
      organisations,
    });
  }
);

// GET BLOOD RECORD OF 3
const getRecentInventoryController = asynchandler(async (req, res) => {
  const inventory = await Inventory
    .find({
      organisation: req.body.userId,
    })
    .limit(3)
    .sort({ createdAt: -1 });
  return res.status(200).send({
    success: true,
    message: "recent Invenotry Data",
    inventory,
  });
});

module.exports = {
  createInventoryController,
  getInventoryController,
  createInventoryHospitalController,
  getDonrsController,
  getRecentInventoryController,
  getHospitalsController,
  getOrganisationsController,
  getOrganisationsHospitalsController,
};
