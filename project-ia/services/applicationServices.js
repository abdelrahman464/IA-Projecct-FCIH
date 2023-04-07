const asyncHandler = require("express-async-handler");
const db = require("../config/database");

// @desc    Get list of jobs
// @route   GET /api/v1/jobs
// @access  public
exports.getApllications = asyncHandler((req, res) => {
  db.query("SELECT * FROM applications", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});
// @desc    Get specific job by id
// @route   GET /api/v1/jobs/:id
// @access  public
exports.getApllication = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM applications WHERE id = ?", [id], (err, results) => {
    if (err) throw new Error(err);

    res.status(200).json({ result: results.length, data: results });
  });
});
// @desc    send application
// @route   POST /api/v1/applications
// @access  protected user
exports.sendApllication = asyncHandler(async (req, res) => {
  const { job_id, attachment } = req.body;
  const created_at = new Date();
  const updated_at = new Date();
  const status = "pending";
  db.query(
    `INSERT INTO applications ( user_id  , job_id  , status ,attachment, created_at , updated_at) VALUES (? , ? ,?, ? , ? )`,
    [req.user.id, job_id, status, attachment, created_at, updated_at],
    (err, results) => {
      if (err) throw err;
      res.json({
        message: "applications send successfully",
        data: results.insertId,
      });
    }
  );
});
// @desc    Update specific application
// @route   PUT /api/v1/applications/:id
// @access  Private/protected (applicant)
exports.updateApllication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { attachment } = req.body;
  const updated_at = new Date();
  db.query(
    `UPDATE applications SET attachment = ? ,updated_at = ? WHERE  id = ?`,
    [attachment, updated_at, id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "applications updated successfully" });
    }
  );
});
// @desc    Delete specific application
// @route   DELETE /api/v1/applications/:id
// @access  Private/protected (applicant)
exports.deleteApllication = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM applications WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.json({ message: "Job deleted successfully" });
  });
});
// @desc    accept an application
// @route   PUT /api/v1/applications/:id
// @access  Private/protected (admin)
exports.acceptApllication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const status = "accepted";
  db.query(
    `UPDATE applications SET status = ?  WHERE  id = ?`,
    [status, id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "applications accepted successfully" });
    }
  );
});
// @desc    reject an application
// @route   PUT /api/v1/applications/:id
// @access  Private/protected (admin)
exports.rejectApllication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const status = "rejected";
  db.query(
    `UPDATE applications SET status = ?  WHERE  id = ?`,
    [status, id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "applications rejected" });
    }
  );
});
