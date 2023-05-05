const asyncHandler = require("express-async-handler");
const db = require("../config/database");

// @desc    Get list of applications
// @route   GET /api/v1/applications
// @access  private/protect (admin)
exports.getApllications = asyncHandler((req, res) => {
  db.query(
    `SELECT users.name as username ,applications.*
    FROM applications 
    JOIN users 
    on applications.user_id = users.id
  `,
    (err, results) => {
      if (err) throw err;
      res.json(results);
    }
  );
});
// @desc    Get specific application by id
// @route   GET /api/v1/applications/:id
// @access  private/protect (admin)
exports.getApllication = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query(
    `SELECT users.name as username ,applications.*
    FROM applications 
    JOIN users 
    on applications.user_id = users.id 
    WHERE applications.id = ?`,
    [id],
    (err, results) => {
      if (err) throw new Error(err);
      res.status(200).json({ result: results.length, data: results });
    }
  );
});
// @desc    send application
// @route   POST /api/v1/applications
// @access  protected applicant
exports.sendApllication = asyncHandler(async (req, res) => {
  const { job_id, attachment } = req.body;
  const created_at = new Date();
  const updated_at = new Date();
  const status = "pending";
  db.query(
    `INSERT INTO applications ( user_id  , job_id , status ,attachment, created_at , updated_at) VALUES (? , ? ,? , ? , ? ,?)`,
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
// @route   PUT /api/v1/applications/:id/accept
// @access  Private/protected (admin)
exports.acceptApllication = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const status = "accepted";
  db.query(
    `UPDATE applications SET status = ?  WHERE  id = ?`,
    [status, id],
    (err, results, fields) => {
      if (err) throw err;
      db.query(
        "SELECT * FROM applications WHERE id = ?",
        [id],
        (err, rows, fields) => {
          if (err) throw err;
          const updatedItem = rows[0];
          db.query(
            "SELECT num_applicant FROM jobs WHERE id = ?",
            [updatedItem.job_id],
            (err, results, fields) => {
              if (err) throw err;
              const plusNum_applicantByOne = results[0].num_applicant + 1;
              db.query("UPDATE jobs SET num_applicant = ? WHERE id = ?", [
                plusNum_applicantByOne,
                updatedItem.job_id,
              ]),
                (err) => {
                  if (err) throw err;
                };
            }
          );
        }
      );

      res.json({ message: "applications accepted successfully" });
    }
  );
});
// @desc    reject an application
// @route   PUT /api/v1/applications/:id/reject
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
// @desc    Get logged user applications
// @route   GET /api/v1/applications/myapplications
// @access  Private/protected (applicant)
exports.getLoggedUserApllications = asyncHandler((req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM applications WHERE user_id = ? ",
    [userId],
    (err, results) => {
      if (err) throw new Error(err);
      res.status(200).json({ result: results.length, data: results });
    }
  );
});
