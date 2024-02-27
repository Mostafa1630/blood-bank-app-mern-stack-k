const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: ["donar", "admin", "organisation", "hospital"],
      default: "user",
    },
    name: {
      type: String,
      required: function () {
        if (this.role === "donar" || this.role === "admin") {
          return true;
        } else {
          return false;
        }
      },
    },
    orgnisationName: {
      type: String,
      required: function () {
        if (this.role === "orgnisation") {
          return true;
        } else {
          return false;
        }
      },
    },
    hospitalName: {
      type: String,
      required: function () {
        if (this.role === "hospital") {
          return true;
        } else {
          return false;
        }
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    wesite: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);
