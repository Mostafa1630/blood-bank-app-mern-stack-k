const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const User = require('../models/authModel')

const verifyToken = async(req, res, next) => {
  const authorization =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authorization) {
    return next(new ApiError("token is required", 401));
  }
  const token = authorization.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // const user =await User.findOne({_id:currentUser.userId})
    // req.user =user;
    req.body.userId = currentUser.userId;
    next();
  } catch (e) {
    return next(new ApiError(e.message, 401));
  }
};
module.exports = verifyToken;
