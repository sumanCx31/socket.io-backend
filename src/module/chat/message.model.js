const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: String,
      default: "anonymous",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);