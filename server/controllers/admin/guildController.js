const Guild = require("../../models/Guild");
const Instructor = require("../../models/Instructor");

exports.createGuild = async (req, res) => {
  try {
    const { name } = req.body;
    const guild = await Guild.create({ name });
    res.status(200).json({ message: "Guild created Successfully !", data: guild });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while add Guild" });
  }
};

// NOTE: kept as-is from the original code — this writes to the Instructor
// collection instead of Guild, which looks like a pre-existing bug. Flagging
// for review rather than silently changing behavior.
exports.addGuild = async (req, res) => {
  try {
    const { name } = req.body;
    const guild = await Instructor.create({ name });
    res.status(200).json({ message: "Guild Added Successfully !", data: guild });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while add Guild" });
  }
};

exports.getGuilds = async (req, res) => {
  try {
    const guild = await Guild.find({});
    res.status(200).json({ message: "Guild List !", data: guild });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while add Guild" });
  }
};

exports.deleteGuild = async (req, res) => {
  try {
    const { id } = req.params;
    await Guild.findByIdAndRemove(id);
    res.json({ message: "guild deleted " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
