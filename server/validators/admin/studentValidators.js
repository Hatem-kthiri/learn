const { body, param } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

exports.quickAddStudent = [
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

exports.addStudent = [
  body("student.firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  body("student.lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  body("student.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email")
    .normalizeEmail(),
  body("student.phone")
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage("Phone must be numeric"),
  body("student.dateOfBirth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("student.course")
    .isArray({ min: 1 })
    .withMessage("At least one course must be selected"),
  body("student.course.0.course")
    .custom(objectId)
    .withMessage("Invalid course id"),
];

exports.studentIdParam = [
  param("id").custom(objectId).withMessage("Invalid student id"),
];

exports.updateStudent = [
  param("id").custom(objectId).withMessage("Invalid student id"),
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

exports.addPayment = [
  param("id").custom(objectId).withMessage("Invalid student id"),
  body("numberOfMonth").notEmpty().withMessage("Number of months is required"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),
  body("paymentDate")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Payment date must be a valid date"),
];

exports.deleteInvoice = [
  param("id").custom(objectId).withMessage("Invalid student id"),
  param("invoiceId").custom(objectId).withMessage("Invalid invoice id"),
];
