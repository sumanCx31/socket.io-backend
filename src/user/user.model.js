const mongoose = require("mongoose");
const Status = require("../config/constant");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 50,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INACTIVE,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
},{
    autoCreate: true,
    autoIndex: true,
    timestamps: true
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
