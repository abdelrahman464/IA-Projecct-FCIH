const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const db = require("../../config/database");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 2 })
    .withMessage("too short User name")
    .isLength({ max: 100 })
    .withMessage("too long User name"),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value) => {
      const emailExists = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [value]
      );
      if (emailExists.length > 0) {
        return Promise.reject(new Error("E-mail already in use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),
  check("passwordConfirm").notEmpty().withMessage("password required"),

  check("role").optional(),

  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
exports.updateUserValidator = [
  body("name").optional(),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(async (value, { req }) => {
      const emailExists = await db.query(
        "SELECT * FROM users WHERE email = ? AND id != ?",
        [value, req.params.id]
      );
      if (emailExists.length > 0) {
        return Promise.reject(new Error("E-mail already in use"));
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("password does not match");
      }
      return true;
    }),
    
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
