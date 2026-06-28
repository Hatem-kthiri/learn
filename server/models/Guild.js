const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});

const Guild = mongoose.model("Guild", guildSchema);

module.exports = Guild;
