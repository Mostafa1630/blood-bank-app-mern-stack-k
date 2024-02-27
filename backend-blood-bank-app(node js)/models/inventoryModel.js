const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    inventoryType: {
      type: String,
      required: [true, "inventoryType is required"],
      enum: ["in", "out"],
    },
    bloodGroup: {
      type: String,
      required: [true, "bloodGroup is required"],
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
    },
    quantity:{
      type:Number,
      required:[true,'quantity is required'],
    },
    email:{
      type:String,
      required:[true,'Email is required']
    },
    orgnisation:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:[true,'orgnisation is required']
    },
    hospital:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:function(){
        return this.inventoryType === 'out';
      }
    },
    donar:{
      type:mongoose.Schema.ObjectId,
      ref:'User',
      required:function(){
        return this.inventoryType === 'in';
      }
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Inventory", inventorySchema);
