const mongoose = require("mongoose");

const skillDataSchema = new mongoose.Schema({
  open: Boolean,
  type: Number,
  skillsName: String,
  skillsData: [],
});

const superSkillSchema = new mongoose.Schema({
  Name: String,
  superSkills: [skillDataSchema],
});

const coursesSchema = new mongoose.Schema({
  title: String,
  data: [superSkillSchema],
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const courses = mongoose.model("courses", coursesSchema);

module.exports = courses;
