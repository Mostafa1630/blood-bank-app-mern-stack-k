const asynchandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/authModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

const registerController = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new ApiError("User Already Exist", 400));
  }
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  const newUser = new User(req.body);
  await newUser.save();
  const token = await createToken(newUser._id);
  newUser.token = token;

  res.status(201).json({
    success: true,
    message: "user register successfully",
    data: { user: newUser },
    token,
  });
});

const loginController = asynchandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("This email not found", 400));
  }
  const comparePssword = await bcrypt.compare(req.body.password, user.password);
  if (!comparePssword) {
    return next(new ApiError("password not correct", 400));
  }
  if(req.body.role != user.role){
    return next(new ApiError("role doesnt match", 400));
  }   
  const token = await createToken(user._id);
  
  res.status(200).json({
    success: true,
    message: "login successfully",
    data: { user },
    token,
  });
});

const getCurrentUserController = asynchandler(async(req,res,next)=>{
  const user = await User.findOne({_id:req.user._id});
  res.status(200).json({
    status: "success",
    message: "login successfully",
    data: { user },
  });
});

module.exports = {
  registerController,
  loginController,
  getCurrentUserController,
};
