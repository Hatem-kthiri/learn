const Attendance = require("../models/Attendance");
const Session = require("../models/Session");
const Guild = require("../models/Guild");

// Instructor opening a session: session info + roster + each student's
// current attendance status for that session (Pending until submitted).
exports.getSessionAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId).populate("guild", "name trainingProgram");
    if (!session) return res.status(404).json({ message: "Session not found" });

    const attendance = await Attendance.find({ session: sessionId }).populate(
      "student",
      "firstName lastName profileImg",
    );

    res.status(200).json({ message: "Session attendance", data: { session, attendance } });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching attendance" });
  }
};

// Body: { records: [{ studentId, status, notes }] }
// Upserts so it's safe to call again if the instructor corrects a mistake.
exports.submitAttendance = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "records array is required" });
    }
    const validStatuses = ["Present", "Absent", "Late", "Excused", "Pending"];
    for (const r of records) {
      if (!validStatuses.includes(r.status)) {
        return res.status(400).json({ message: `Invalid status: ${r.status}` });
      }
    }

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    await Promise.all(
      records.map((r) =>
        Attendance.findOneAndUpdate(
          { session: sessionId, student: r.studentId },
          { status: r.status, notes: r.notes || "" },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        ),
      ),
    );

    // Submitting attendance means the session happened.
    if (session.status !== "Completed") {
      session.status = "Completed";
      await session.save();
    }

    const updated = await Attendance.find({ session: sessionId }).populate(
      "student",
      "firstName lastName profileImg",
    );
    res.status(200).json({ message: "Attendance saved", data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while saving attendance" });
  }
};

// Student's own attendance history across every guild they've been in,
// with summary stats.
exports.getStudentAttendanceHistory = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ student: studentId })
      .populate("guild", "name")
      .populate("session", "sessionNumber date startTime endTime status")
      .sort({ createdAt: -1 });

    const stats = {
      totalSessions: records.length,
      present: records.filter((r) => r.status === "Present").length,
      absent: records.filter((r) => r.status === "Absent").length,
      late: records.filter((r) => r.status === "Late").length,
      excused: records.filter((r) => r.status === "Excused").length,
      pending: records.filter((r) => r.status === "Pending").length,
    };
    const gradedCount = stats.totalSessions - stats.pending;
    stats.attendancePercentage =
      gradedCount > 0 ? Math.round(((stats.present + stats.late) / gradedCount) * 100) : null;

    res.status(200).json({ message: "Student attendance history", data: { records, stats } });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching attendance history" });
  }
};

// Instructor report, filterable by guild / session / student via query
// params — matches the "By Guild / By Session / By Student" views.
exports.getInstructorAttendanceReport = async (req, res) => {
  try {
    const { guildId } = req.params;
    const { sessionId, studentId } = req.query;

    const filter = { guild: guildId };
    if (sessionId) filter.session = sessionId;
    if (studentId) filter.student = studentId;

    const records = await Attendance.find(filter)
      .populate("student", "firstName lastName profileImg")
      .populate("session", "sessionNumber date startTime endTime status")
      .sort({ "session.sessionNumber": 1 });

    const totalRecords = records.length;
    const present = records.filter((r) => r.status === "Present").length;
    const absent = records.filter((r) => r.status === "Absent").length;
    const late = records.filter((r) => r.status === "Late").length;
    const excused = records.filter((r) => r.status === "Excused").length;
    const gradedCount = totalRecords - records.filter((r) => r.status === "Pending").length;

    const stats = {
      totalRecords,
      present,
      absent,
      late,
      excused,
      totalAbsences: absent,
      totalLates: late,
      attendanceRate: gradedCount > 0 ? Math.round(((present + late) / gradedCount) * 100) : null,
    };

    res.status(200).json({ message: "Attendance report", data: { records, stats } });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while generating the report" });
  }
};

// CSV export for a guild's full attendance history.
exports.exportGuildAttendance = async (req, res) => {
  try {
    const { guildId } = req.params;
    const guild = await Guild.findById(guildId);
    if (!guild) return res.status(404).json({ message: "Guild not found" });

    const records = await Attendance.find({ guild: guildId })
      .populate("student", "firstName lastName")
      .populate("session", "sessionNumber date startTime endTime")
      .sort({ "session.sessionNumber": 1 });

    const header = "Session Number,Date,Student,Status,Notes\n";
    const rows = records
      .map((r) => {
        const date = r.session?.date ? new Date(r.session.date).toISOString().slice(0, 10) : "";
        const student = r.student ? `${r.student.firstName} ${r.student.lastName}` : "";
        const notes = (r.notes || "").replace(/"/g, '""');
        return `${r.session?.sessionNumber ?? ""},${date},"${student}",${r.status},"${notes}"`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${guild.name.replace(/[^a-z0-9]/gi, "_")}_attendance.csv"`,
    );
    res.status(200).send(header + rows);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while exporting attendance" });
  }
};
