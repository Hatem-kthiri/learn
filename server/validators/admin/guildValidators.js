const { body, param } = require("express-validator");

const objectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

exports.createGuild = [
  body("name").trim().notEmpty().withMessage("Guild name is required"),
];

exports.guildIdParam = [
  param("id").custom(objectId).withMessage("Invalid guild id"),
];
