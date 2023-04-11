const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const db = require("../config/database");

//@desc signup
//@route POST /api/v1/auth/signup
//@access public
exports.signup = asyncHandler(async (req, res, next) => {
  //1-create user
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const created_at = new Date();
  const updated_at = new Date();
  db.query(
    `INSERT INTO users 
      (name,email,password,role,phone,status,created_at,updated_at)
    VALUES
       (?, ? , ? ,"applicant" , ? , "active" , ? , ?)`,
    [name, email, hashedPassword, phone, created_at, updated_at],
    (err, results) => {
      if (err) throw err;

      res.status(201).json({
        message: "welcom with us",
        data: results.insertId,
      });
    }
  );
});
//@desc login
//@route POST /api/v1/auth/login
//@access public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Query the database for the user's record
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
    // User not found
    if (rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }
    // Compare password hash with stored hash
    const user = rows[0];
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }
      // Passwords match
      if (result) {
        const token = generateToken(user.id);
        res.status(200).json({ data: user, token: token });
      }
      // Passwords do not match
      if (!result) {
        return res.status(401).send("Invalid email or password");
      }
    });
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  //1- check if token exists, if exist get it
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new Error("you are not login,please login first"));
  }
  //2- verify token (no change happens,expired token)
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  //3-check if user exists
  db.query(
    "SELECT * FROM users WHERE id = ?",
    [decoded.userId],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Internal server error");
      }

      if (rows.length === 0) {
        next(new Error("user is not available"));
      }
      const currentUser = rows[0];
      //add user to request
      //to use this in authorization
      // check if user is already registered
      req.user = currentUser;
      next();
    }
  );
});
//@desc  Authorization (user permissions)
// ....roles => retrun array for example ["admin","applicatn"]
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- access roles
    //2- access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(new Error("you are not allowed to access this route"));
    }
    next();
  });
