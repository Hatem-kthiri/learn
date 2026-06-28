const { validationResult } = require("express-validator");

/**
 * Wraps an array of express-validator chains. Runs them, then checks for
 * errors before letting the request reach the controller.
 *
 * Usage:
 *   router.post("/add-student", validate(studentValidators.addStudent), studentController.addStudent);
 */
const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      status: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  };
};

module.exports = validate;
