const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    guild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guild",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // "HH:mm"
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Upcoming", "InProgress", "Completed", "Cancelled"],
      default: "Upcoming",
    },
  },
  { timestamps: true },
);

sessionSchema.index({ guild: 1, sessionNumber: 1 }, { unique: true });
sessionSchema.index({ instructor: 1, date: 1 });
sessionSchema.index({ guild: 1, date: 1 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
