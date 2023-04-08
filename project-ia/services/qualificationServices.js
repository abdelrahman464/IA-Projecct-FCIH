const asyncHandler = require("express-async-handler");
const db = require("../config/database");

// @desc    Get list of Qualifications
// @route   GET /api/v1/qualifications
// @access  public
exports.getQualifications = asyncHandler((req, res) => {
  db.query("SELECT * FROM qualifications", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// @desc    Get specific Qualification by id
// @route   GET /api/v1/qualifications/:id
// @access  public
exports.getQualification = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM qualifications WHERE id = ?",
    [id],
    (err, results) => {
      if (err) throw new Error(err);

      res.status(200).json({ result: results.length, data: results });
    }
  );
});
// @desc    Create Qualification
// @route   POST  /api/v1/qualifications
// @access  Private/protected  (admin)
exports.createQualification = asyncHandler(async (req, res) => {
  const { job_id, description } = req.body;
  const created_at = new Date();
  const updated_at = new Date();
  db.query(
    `INSERT INTO qualifications 
      (job_id,description,created_at,updated_at	)
    VALUES
       (?,?,?,?)`,
    [job_id, description, created_at, updated_at],
    (err, results) => {
      if (err) throw err;

      res.json({
        message: "qualification created successfully",
        data: results.insertId,
      });
    }
  );
});
// @desc    Update specific Qualification
// @route   PUT /api/v1/qualifications/:id
// @access  Private/protected  (admin)
exports.updateQualification = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { job_id, description } = req.body;
  const updated_at = new Date();
  db.query(
    `UPDATE qualifications SET job_id = ?, description = ?,updated_at = ? WHERE  id = ?`,
    [job_id, description, updated_at, id],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "qualification updated successfully" });
    }
  );
});
// @desc    Delete specific Qualification
// @route   DELETE /api/v1/qualifications/:id
// @access  Private/protected  (admin)
exports.deleteQualification = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM qualifications WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.json({ message: "qualification deleted successfully" });
  });
});

// @desc    search in jobs based on qualifications
// @route   POST /api/v1/qualifications/search?keyword=:keyword
// @access  public
exports.searchInJobs = asyncHandler((req, res) => {
  const keyword = req.body.keyword; // get search query from request query parameters
  // Build SQL query to search for records that match the search query
  const values = [`%${keyword}%`];

  // Execute the SQL query
  db.query(
    `SELECT *
     FROM qualifications
     WHERE description LIKE ?`,
    values,
    (err, results) => {
      if (err) throw new Error(err);
      db.query(
        `INSERT INTO searchedjobs 
          (word,results,user_id,job_id	)
        VALUES
           (?,?,?,?)`,
        [keyword, JSON.stringify(results[0]), req.user.id, results[0].job_id],
        (err, results) => {
          if (err) throw err;
        }
      );
      res.status(200).json({ result: results.length, data: results });
    }
  );
});


