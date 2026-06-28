const { body, param, query } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

exports.idParam = [param("id").custom(objectId).withMessage("Invalid id")];

exports.guildQuery = [
  query("guild").notEmpty().withMessage("guild query param is required"),
];

exports.submitCheckpointScore = [
  param("id").custom(objectId).withMessage("Invalid checkpoint id"),
  body("score").notEmpty().withMessage("score is required"),
];

exports.updateInstructorProfile = [
  param("userId").custom(objectId).withMessage("Invalid user id"),
];

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

exports.addMeeting = [
  param("id").custom(objectId).withMessage("Invalid instructor id"),
  body("name").trim().notEmpty().withMessage("Meeting name is required"),
  body("link").trim().notEmpty().withMessage("Meeting link is required"),
  body("time").notEmpty().withMessage("Meeting time is required"),
];

exports.createWorkshop = [
  body("name").trim().notEmpty().withMessage("Workshop name is required"),
  body("link").trim().notEmpty().withMessage("Workshop link is required"),
  body("instructor").custom(objectId).withMessage("Invalid instructor id"),
  body("guild").optional({ checkFalsy: true }),
];
