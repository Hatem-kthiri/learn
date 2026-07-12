const Guild = require("../../models/Guild");
const Instructor = require("../../models/Instructor");
const Student = require("../../models/Student");
const Session = require("../../models/Session");
const Attendance = require("../../models/Attendance");
const {
  generateSessionDates,
  validateSlotsMatchDuration,
} = require("../../services/sessionGenerator");

// Creates one Session + one Attendance (per student) doc for each entry
// produced by generateSessionDates. Shared by createGuild and
// regenerateSessions so both stay in sync with the same logic.
async function createSessionsAndAttendance({ guild, fromSessionNumber = 1 }) {
  const dates = generateSessionDates({
    startDate: guild.startDate,
    weeklySlots: guild.weeklySlots,
    totalSessions: guild.totalSessions,
  }).filter((s) => s.sessionNumber >= fromSessionNumber);

  const sessionDocs = await Session.insertMany(
    dates.map((d) => ({
      guild: guild._id,
      instructor: guild.instructor,
      sessionNumber: d.sessionNumber,
      date: d.date,
      startTime: d.startTime,
      endTime: d.endTime,
      status: "Upcoming",
    })),
  );

  const attendanceDocs = [];
  for (const session of sessionDocs) {
    for (const studentId of guild.students) {
      attendanceDocs.push({
        session: session._id,
        guild: guild._id,
        student: studentId,
        status: "Pending",
      });
    }
  }
  if (attendanceDocs.length > 0) {
    await Attendance.insertMany(attendanceDocs);
  }

  return sessionDocs;
}

exports.createGuild = async (req, res) => {
  try {
    const {
      name,
      trainingProgram,
      startDate,
      instructor,
      students,
      sessionDuration,
      totalSessions,
      sessionsPerWeek,
      weeklySlots,
    } = req.body;

    if (!name || !startDate || !instructor || !sessionDuration || !totalSessions || !sessionsPerWeek) {
      return res.status(400).json({ message: "Missing required guild fields" });
    }
    if (!weeklySlots || weeklySlots.length !== sessionsPerWeek) {
      return res.status(400).json({
        message: `Expected exactly ${sessionsPerWeek} weekly slot(s) for sessionsPerWeek=${sessionsPerWeek}, got ${weeklySlots?.length || 0}`,
      });
    }

    validateSlotsMatchDuration(weeklySlots, sessionDuration);

    const guild = await Guild.create({
      name,
      trainingProgram,
      startDate,
      instructor,
      students: students || [],
      sessionDuration,
      totalSessions,
      sessionsPerWeek,
      weeklySlots,
    });

    const sessions = await createSessionsAndAttendance({ guild });

    // Keep the legacy string-guild fields other features already rely on
    // (Instructor.guild is an array of guild names; Student.course[].guild
    // is a single guild name) in sync with this new guild's roster.
    if (instructor) {
      await Instructor.findByIdAndUpdate(instructor, { $addToSet: { guild: name } });
    }
    if (students && students.length > 0) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $set: { "course.$[].guild": name } },
      );
    }

    res.status(201).json({
      message: "Guild created successfully",
      data: { guild, sessionsGenerated: sessions.length },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while creating the guild" });
  }
};

// Legacy behavior preserved as-is (see prior note): writes to Instructor,
// not Guild. Not touched — out of scope for this feature and changing it
// could break whatever currently calls it.
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
    const guild = await Guild.find({})
      .populate("instructor", "firstName lastName profileImg")
      .populate("students", "firstName lastName profileImg");
    res.status(200).json({ message: "Guild List !", data: guild });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while add Guild" });
  }
};

exports.getGuildById = async (req, res) => {
  try {
    const { id } = req.params;
    const guild = await Guild.findById(id)
      .populate("instructor", "firstName lastName profileImg email")
      .populate("students", "firstName lastName profileImg email");
    if (!guild) return res.status(404).json({ message: "Guild not found" });
    res.status(200).json({ message: "Guild details", data: guild });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

exports.deleteGuild = async (req, res) => {
  try {
    const { id } = req.params;
    await Guild.findByIdAndRemove(id);
    await Session.deleteMany({ guild: id });
    await Attendance.deleteMany({ guild: id });
    res.json({ message: "guild deleted " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: update roster/instructor. Does NOT touch schedule config or
// existing sessions — use regenerateSessions for schedule changes.
exports.updateGuild = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, trainingProgram, instructor, students, status } = req.body;

    const guild = await Guild.findById(id);
    if (!guild) return res.status(404).json({ message: "Guild not found" });

    const previousInstructor = String(guild.instructor || "");

    if (name !== undefined) guild.name = name;
    if (trainingProgram !== undefined) guild.trainingProgram = trainingProgram;
    if (instructor !== undefined) guild.instructor = instructor;
    if (students !== undefined) guild.students = students;
    if (status !== undefined) guild.status = status;
    await guild.save();

    // Keep future (not-yet-completed) sessions' instructor field in sync
    // if the instructor changed.
    if (instructor && String(instructor) !== previousInstructor) {
      await Session.updateMany(
        { guild: guild._id, status: { $in: ["Upcoming", "InProgress"] } },
        { $set: { instructor } },
      );
    }

    // New students added to an existing guild need Attendance rows for
    // every session that already exists (past and future), starting at
    // Pending so historical gaps are visible rather than silently absent.
    if (students !== undefined) {
      const existingSessions = await Session.find({ guild: guild._id }).select("_id");
      const existingAttendance = await Attendance.find({ guild: guild._id }).select("student session");
      const haveAttendance = new Set(
        existingAttendance.map((a) => `${a.student}:${a.session}`),
      );
      const toInsert = [];
      for (const studentId of students) {
        for (const session of existingSessions) {
          const key = `${studentId}:${session._id}`;
          if (!haveAttendance.has(key)) {
            toInsert.push({
              session: session._id,
              guild: guild._id,
              student: studentId,
              status: "Pending",
            });
          }
        }
      }
      if (toInsert.length > 0) await Attendance.insertMany(toInsert);

      // Remove attendance for students no longer on the roster, but only
      // for sessions that haven't happened/been recorded yet — never
      // delete historical attendance for a student who was removed later.
      await Attendance.deleteMany({
        guild: guild._id,
        student: { $nin: students },
        status: "Pending",
      });
    }

    res.status(200).json({ message: "Guild updated", data: guild });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while updating the guild" });
  }
};

// Regenerates all sessions that haven't started yet (status "Upcoming").
// Completed/InProgress/Cancelled sessions and their attendance are left
// untouched — this only replaces the future schedule, e.g. after changing
// the weekly slots or extending totalSessions.
exports.regenerateSessions = async (req, res) => {
  try {
    const { id } = req.params;
    const { weeklySlots, totalSessions, sessionDuration } = req.body;

    const guild = await Guild.findById(id);
    if (!guild) return res.status(404).json({ message: "Guild not found" });

    if (weeklySlots) guild.weeklySlots = weeklySlots;
    if (totalSessions) guild.totalSessions = totalSessions;
    if (sessionDuration) guild.sessionDuration = sessionDuration;
    validateSlotsMatchDuration(guild.weeklySlots, guild.sessionDuration);
    await guild.save();

    const lastLockedSession = await Session.findOne({
      guild: guild._id,
      status: { $in: ["Completed", "InProgress", "Cancelled"] },
    }).sort({ sessionNumber: -1 });

    const fromSessionNumber = lastLockedSession ? lastLockedSession.sessionNumber + 1 : 1;

    const upcomingIds = await Session.find({
      guild: guild._id,
      status: "Upcoming",
    }).distinct("_id");
    await Attendance.deleteMany({ session: { $in: upcomingIds } });
    await Session.deleteMany({ _id: { $in: upcomingIds } });

    const sessions = await createSessionsAndAttendance({ guild, fromSessionNumber });

    res.status(200).json({
      message: "Future sessions regenerated",
      data: { sessionsGenerated: sessions.length },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "An error occurred while regenerating sessions" });
  }
};

exports.cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findByIdAndUpdate(
      sessionId,
      { status: "Cancelled" },
      { new: true },
    );
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.status(200).json({ message: "Session cancelled", data: session });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while cancelling the session" });
  }
};

// "[Program Name] Cohort [2-letter initials][2-digit number]", e.g.
// "Web Development Cohort WD01". Scans existing guild names sharing the
// same program+initials to pick the next free number.
exports.generateGuildName = async (req, res) => {
  try {
    const { programName } = req.query;
    if (!programName || !programName.trim()) {
      return res.status(400).json({ message: "programName is required" });
    }

    const initials = programName
      .trim()
      .split(/\s+/)
      .map((w) => w[0].toUpperCase())
      .join("")
      .slice(0, 3);

    const prefix = `${programName.trim()} Cohort ${initials}`;
    const existing = await Guild.find({
      name: { $regex: `^${prefix}\\d+$` },
    }).select("name");

    const usedNumbers = existing.map((g) => {
      const match = g.name.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    });
    const nextNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
    const suggestedName = `${prefix}${String(nextNumber).padStart(2, "0")}`;

    res.status(200).json({ message: "Generated guild name", data: { name: suggestedName } });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while generating a guild name" });
  }
};

