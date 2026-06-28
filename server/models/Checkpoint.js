const mongoose = require("mongoose");

const checkpointSchema = new mongoose.Schema({
  checkpointName: {
    type: String,
  },
  checkpointId: {
    type: String,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  guild: {
    type: String,
  },
  score: {
    type: Number,
    default: 0,
  },
  link: {
    type: String,
    required: true,
  },
  open: {
    type: Boolean,
    default: true,
  },
});

// Queried as { student } for list, { checkpointId, student } for existence check
checkpointSchema.index({ student: 1 });
checkpointSchema.index({ checkpointId: 1, student: 1 });

const Checkpoint = mongoose.model("Checkpoint", checkpointSchema);
module.exports = Checkpoint;
