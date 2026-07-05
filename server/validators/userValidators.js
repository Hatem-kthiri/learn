const { body, param } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

// ── Auth ─────────────────────────────────────────────────────────────────
exports.login = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ── Password change / recovery ──────────────────────────────────────────
// These two routes previously accepted any string as a new password with
// zero validation — no length, no complexity check at all.
const strongPassword = (field) =>
  body(field)
    .isLength({ min: 8 })
    .withMessage(`${field} must be at least 8 characters`)
    .matches(/[a-zA-Z]/)
    .withMessage(`${field} must contain at least one letter`)
    .matches(/[0-9]/)
    .withMessage(`${field} must contain at least one number`);

exports.updatePassword = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  strongPassword("newPassword"),
];

exports.sendEmailRecovery = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("code").notEmpty().withMessage("Recovery code is required"),
];

exports.passwordRecovery = [
  param("email").isEmail().withMessage("Must be a valid email").normalizeEmail(),
  strongPassword("newPassword"),
];

// ── Checkpoints ──────────────────────────────────────────────────────────
exports.addCheckpoint = [
  body("checkpointName").trim().notEmpty().withMessage("checkpointName is required"),
  body("checkpointId").notEmpty().withMessage("checkpointId is required"),
  body("student").custom(objectId).withMessage("Invalid student id"),
  body("guild").optional({ checkFalsy: true }),
  body("link").optional({ checkFalsy: true }).isString(),
];

exports.updateCheckpoint = [
  param("id").custom(objectId).withMessage("Invalid checkpoint id"),
];

exports.getCheckpoint = [
  param("studentId").custom(objectId).withMessage("Invalid student id"),
  param("checkpointId").notEmpty().withMessage("checkpointId is required"),
];

// ── Course progress ──────────────────────────────────────────────────────
exports.editCourseId = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("chapterId").notEmpty().withMessage("chapterId is required"),
  body("skillsId").notEmpty().withMessage("skillsId is required"),
];

exports.updateOpenCourse = [
  param("superSkillsIndex")
    .isInt({ min: 0 })
    .withMessage("superSkillsIndex must be a non-negative integer"),
  param("skillsIndex")
    .isInt({ min: 0 })
    .withMessage("skillsIndex must be a non-negative integer"),
  param("learningScheduleId")
    .custom(objectId)
    .withMessage("Invalid learning schedule id"),
];

exports.openSkill = [
  body("userId").custom(objectId).withMessage("Invalid user id"),
  body("courseId").custom(objectId).withMessage("Invalid course id"),
  body("superSkillsId").notEmpty().withMessage("superSkillsId is required"),
  body("skillsId").notEmpty().withMessage("skillsId is required"),
];

exports.updateLearnProgress = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("learnProgress").notEmpty().withMessage("learnProgress is required"),
];

exports.updateLearnScore = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("learnScore").notEmpty().withMessage("learnScore is required"),
];

// ── Quiz ──────────────────────────────────────────────────────────────────
exports.addQuizScore = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("quizId").notEmpty().withMessage("quizId is required"),
  body("quizScore").notEmpty().withMessage("quizScore is required"),
];

exports.getQuiz = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  param("quizId").notEmpty().withMessage("quizId is required"),
];

exports.userIdParam = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
];

// ── Profile ───────────────────────────────────────────────────────────────
exports.updateStudentProfile = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  body("studentUpdate")
    .notEmpty()
    .withMessage("studentUpdate is required")
    .custom((value) => {
      try {
        JSON.parse(value);
        return true;
      } catch {
        throw new Error("studentUpdate must be valid JSON");
      }
    }),
];

// ── Guild / schedule lookups ────────────────────────────────────────────
exports.guildParam = [
  param("guild").notEmpty().withMessage("guild is required"),
];

exports.learningScheduleParams = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
  param("courseId").custom(objectId).withMessage("Invalid course id"),
];
