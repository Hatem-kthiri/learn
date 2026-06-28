const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  course: [{ type: mongoose.Schema.Types.ObjectId, ref: "course" }],
  email: {
    type: String,
    required: true,
    unique: true,   // creates index automatically
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
  },
  profileImg: {
    type: String,
    default:
      "https://gambolthemes.net/html-items/cursus_main_demo/images/left-imgs/img-10.jpg",
  },
  guild: [],
  role: {
    type: String,
    default: 1,
  },
});

// Index: instructors are looked up by guild for meeting/student queries
instructorSchema.index({ guild: 1 });

module.exports = mongoose.model("instructor", instructorSchema);
