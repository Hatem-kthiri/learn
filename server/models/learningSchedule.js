const mongoose = require("mongoose");

const learningScheduleSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  learning: [
    {
      Name: String,
      _id: String,
      details: [],
    },
  ],
});

// This is the most queried collection — every page load calls findOne({ student, courseId })
learningScheduleSchema.index({ student: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("learningSchedule", learningScheduleSchema);
