const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "Student",
    },
    message: {
      type: String,
      trim: true,
    },
    chat: {
      type: mongoose.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
