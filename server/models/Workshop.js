const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  link: {
    type: String,
    required: true,
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

module.exports = mongoose.model("workshop", workshopSchema);
