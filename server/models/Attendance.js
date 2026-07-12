const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },
    // Denormalized so guild-wide / student-wide reports don't need to
    // populate through session for every query.
    guild: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guild",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Present", "Absent", "Late", "Excused"],
      default: "Pending",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

// One attendance record per student per session.
attendanceSchema.index({ session: 1, student: 1 }, { unique: true });
attendanceSchema.index({ guild: 1, student: 1 });
attendanceSchema.index({ student: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
