const { body, param } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

exports.quickAddInstructor = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
];

exports.addInstructor = [
  body("instructor.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("instructor.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("instructor.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("instructor.phone")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Phone must be numeric"),
];

exports.instructorIdParam = [
  param("id").custom(objectId).withMessage("Invalid instructor id"),
];

exports.editInstructor = [
  param("id").custom(objectId).withMessage("Invalid instructor id"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Phone must be numeric"),
];
