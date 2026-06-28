const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  quizId: {
    type: String,
  },
  quizScore: {
    type: String,
  },
  response: {
    assessmentType: { type: String },
    quizResponse: [],
  },
});

// Queried as { student, quizId } on every quiz submission check
quizSchema.index({ student: 1, quizId: 1 });

module.exports = mongoose.model("quiz", quizSchema);
