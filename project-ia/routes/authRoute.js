const express = require("express");
// const { loginValidator } = require("../utils/validators/authValidator");
const { login } = require("../services/authServices");

const router = express.Router();

router.route("/login").post(login);

module.exports = router;
