const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const db = require("../config/database");
const ApiError = require("../utils/apiError");

// @desc    Get list of users
// @route   GET /api/v1/users
// @access  private
exports.getUsers = asyncHandler((req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc    Get specific user by id
// @route   GET /api/v1/user/:id
// @access  private
exports.getUser = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) throw new Error(err);

    res.status(200).json({ result: results.length, data: results });
  });
});
// @desc    Create user
// @route   POST  /api/v1/users
// @access  Private
exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const created_at = new Date();
  const updated_at = new Date();
  db.query(
    `INSERT INTO users (name, email, password, role , phone,created_at,updated_at)
     VALUES (? , ? , ? , 'applicant', ?,?,?)`,
    [name, email, hashedPassword, phone, created_at, updated_at],
    (err, results) => {
      if (err) throw err;

      res.json({
        message: "User created successfully",
        data: results.insertId,
      });
    }
  );
});
// @desc    Update specific user
// @route   PUT /api/v1/users/:id
// @access  Private
exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email, password, phone, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    "UPDATE users SET name = ?, email = ?, password = ? , phone = ? ,role = ? WHERE id = ?",
    [name, email, hashedPassword, phone, role, id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "User updated successfully" });
    }
  );
});
// @desc    Delete specific user
// @route   DELETE /api/v1/users/:id
// @access  Private
exports.deleteUser = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.json({ message: "User deleted successfully" });
  });
});
