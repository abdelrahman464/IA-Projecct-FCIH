const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const db = require("../../config/database");

const isEmailAlreadyInUse = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT COUNT(*) AS count FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          const count = results[0].count;
          resolve(count > 0);
        }
      }
    );
  });
};
exports.signupValidator = [
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
    .custom(async (email) => {
      if (await isEmailAlreadyInUse(email)) {
        throw new Error("Email already in use");
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
  check("phone")
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted Egy and SA Phone numbers"),

  validatorMiddleware,
];
exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters")
    .isLength({ max: 32 })
    .withMessage("password must be at least 8 characters"),
  validatorMiddleware,
];
