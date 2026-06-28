const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
  },
  guild: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor",
    required: true,
  },
});

module.exports = mongoose.model("meeting", meetingSchema);
