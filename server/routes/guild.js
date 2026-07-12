const express = require("express");
const router = express.Router();

const sessionController = require("../controllers/sessionController");
const attendanceController = require("../controllers/attendanceController");

// ── Sessions ─────────────────────────────────────────────────────────────
router.get("/sessions/instructor/:instructorId", sessionController.getSessionsByInstructor);
router.get("/sessions/:id", sessionController.getSessionById);
router.patch("/sessions/:id/status", sessionController.updateSessionStatus);
router.patch("/sessions/:id/cancel", sessionController.cancelSession);

// ── Attendance ───────────────────────────────────────────────────────────
// Instructor opens a session to take attendance.
router.get("/sessions/:sessionId/attendance", attendanceController.getSessionAttendance);
router.post("/sessions/:sessionId/attendance", attendanceController.submitAttendance);

// Student's own history.
router.get("/students/:studentId/attendance", attendanceController.getStudentAttendanceHistory);

// Instructor reports: /guilds/:guildId/attendance-report?sessionId=&studentId=
router.get("/guilds/:guildId/attendance-report", attendanceController.getInstructorAttendanceReport);
router.get("/guilds/:guildId/attendance-export", attendanceController.exportGuildAttendance);
router.get("/guilds/:guildId/sessions", sessionController.getSessionsByGuild);

module.exports = router;
