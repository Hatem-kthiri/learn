const Session = require("../models/Session");

exports.getSessionsByGuild = async (req, res) => {
  try {
    const { guildId } = req.params;
    const sessions = await Session.find({ guild: guildId }).sort({ sessionNumber: 1 });
    res.status(200).json({ message: "Sessions", data: sessions });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching sessions" });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("guild", "name trainingProgram")
      .populate("instructor", "firstName lastName");
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ message: "Session details", data: session });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// All upcoming/in-progress sessions across every guild an instructor teaches,
// soonest first — powers the instructor's "sessions to run" list.
exports.getSessionsByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const sessions = await Session.find({ instructor: instructorId })
      .populate("guild", "name trainingProgram")
      .sort({ date: 1 });
    res.status(200).json({ message: "Instructor sessions", data: sessions });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching sessions" });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByIdAndUpdate(id, { status: "Cancelled" }, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ message: "Session cancelled", data: session });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while cancelling the session" });
  }
};

// Marks a session InProgress/Completed. Kept separate from attendance
// submission so an instructor can open a session before marking anyone.
exports.updateSessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Upcoming", "InProgress", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    const session = await Session.findByIdAndUpdate(id, { status }, { new: true });
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ message: "Session status updated", data: session });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};
