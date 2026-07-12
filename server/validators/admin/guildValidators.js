const { body, param, query } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

const weeklySlotsValidator = body("weeklySlots")
  .isArray({ min: 1 })
  .withMessage("At least one weekly slot is required")
  .custom((slots) =>
    slots.every(
      (s) =>
        Number.isInteger(s.dayOfWeek) &&
        s.dayOfWeek >= 0 &&
        s.dayOfWeek <= 6 &&
        typeof s.startTime === "string" &&
        typeof s.endTime === "string",
    ),
  )
  .withMessage("Each weekly slot needs dayOfWeek (0-6), startTime, and endTime");

exports.createGuild = [
  body("name").trim().notEmpty().withMessage("Guild name is required"),
  body("startDate").notEmpty().withMessage("Start date is required").isISO8601(),
  body("instructor").custom(objectId).withMessage("Valid instructor id is required"),
  body("sessionDuration").isIn([2, 3, 4]).withMessage("Session duration must be 2, 3, or 4 hours"),
  body("totalSessions").isInt({ min: 1 }).withMessage("Total sessions must be at least 1"),
  body("sessionsPerWeek").isIn([1, 2, 3]).withMessage("Sessions per week must be 1, 2, or 3"),
  weeklySlotsValidator,
];

exports.guildIdParam = [
  param("id").custom(objectId).withMessage("Invalid guild id"),
];

exports.updateGuild = [
  param("id").custom(objectId).withMessage("Invalid guild id"),
  body("instructor").optional().custom(objectId).withMessage("Invalid instructor id"),
  body("students").optional().isArray().withMessage("students must be an array"),
];

exports.regenerateSessions = [
  param("id").custom(objectId).withMessage("Invalid guild id"),
  body("weeklySlots").optional().isArray({ min: 1 }),
  body("totalSessions").optional().isInt({ min: 1 }),
  body("sessionDuration").optional().isIn([2, 3, 4]),
];

exports.generateGuildName = [
  query("programName").trim().notEmpty().withMessage("programName is required"),
];

