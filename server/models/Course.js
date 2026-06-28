const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: [],
  image: {
    type: String,
  },
  status: {
    type: String,
    default: "draft",
  },
});

// Index: list page filters by status, search by title
courseSchema.index({ status: 1 });
courseSchema.index({ title: "text" });

module.exports = mongoose.model("course", courseSchema);
