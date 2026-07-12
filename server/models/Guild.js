const mongoose = require("mongoose");

// A single recurring weekly slot, e.g. { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" }
// dayOfWeek follows JS Date.getDay(): 0 = Sunday ... 6 = Saturday.
const weeklySlotSchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    startTime: { type: String, required: true }, // "HH:mm", 24h
    endTime: { type: String, required: true },
  },
  { _id: false },
);

const guildSchema = new mongoose.Schema(
  {
    // Kept required+unique: Meetings.guild, Workshop.guild, and
    // Student.course[].guild all reference a guild by this name string
    // (not by ObjectId), so it must stay a stable, unique identifier.
    name: {
      type: String,
      required: true,
      unique: true,
    },
    trainingProgram: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "instructor",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    // Scheduling configuration used to (re)generate sessions.
    sessionDuration: {
      type: Number, // hours: 2, 3, or 4
      enum: [2, 3, 4],
    },
    totalSessions: {
      type: Number,
      min: 1,
    },
    sessionsPerWeek: {
      type: Number,
      enum: [1, 2, 3],
    },
    weeklySlots: [weeklySlotSchema],
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

guildSchema.index({ instructor: 1 });
guildSchema.index({ students: 1 });

const Guild = mongoose.model("Guild", guildSchema);

module.exports = Guild;
