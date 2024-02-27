const User = require("../models/authModel");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    //check admin
    if (user?.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "AUth Fialed",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Auth Failed, ADMIN API",
      error,
    });
  }
};
