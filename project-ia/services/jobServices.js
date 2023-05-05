const asyncHandler = require("express-async-handler");
const db = require("../config/database");

// @desc    Get list of jobs
// @route   GET /api/v1/jobs
// @access  public
exports.getJobs = asyncHandler((req, res) => {
  db.query(
    `SELECT jobs.id,jobs.position,jobs.requirements,jobs.salary,
    jobs.description as job_description,jobs.maxCandidateNumber,
    qualifications.description as qualification_description
     FROM jobs
     LEFT JOIN qualifications 
    on qualifications.job_id = jobs.id 
     WHERE jobs.maxCandidateNumber > jobs.num_applicant`,
    (err, results) => {
      if (err) throw err;
      res.json({ result: results.length, data: results });
    }
  );
});
// @desc    Get list of jobs
// @route   GET /api/v1/jobs/all
// @access  private/protected (admin)
exports.getJobsAdmin = asyncHandler((req, res) => {
  db.query(
    `SELECT jobs.id,jobs.position,jobs.requirements,jobs.salary,
  jobs.description as job_description, jobs.num_applicant,jobs.maxCandidateNumber,
  qualifications.description as qualification_description
   FROM jobs
  LEFT JOIN qualifications 
  on qualifications.job_id = jobs.id `,
    (err, results) => {
      if (err) throw err;
      res.json({ result: results.length, data: results });
    }
  );
});

// @desc    Get specific job by id
// @route   GET /api/v1/jobs/:id
// @access  protected
exports.getJob = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query(
    `SELECT jobs.id,jobs.position,jobs.requirements,jobs.salary,
    jobs.description as job_description ,	jobs.maxCandidateNumber,
    qualifications.description as qualification_description
     FROM jobs
     LEFT JOIN qualifications 
    on qualifications.job_id = jobs.id 
    WHERE jobs.id = ?`,
    [id],
    (err, results) => {
      if (err) throw new Error(err);

      res.status(200).json({  data: results });
    }
  );
});
// @desc    Create job
// @route   POST  /api/v1/jobs
// @access  Private/protected  (admin)
exports.createJob = asyncHandler(async (req, res) => {
  const { position, description, requirements, salary, maxCandidateNumber } =
    req.body;
  const created_at = new Date();
  const updated_at = new Date();
  db.query(
    `INSERT INTO jobs 
      ( position, description,requirements,salary , maxCandidateNumber,created_at,updated_at	)
    VALUES
       (?,?,?, ?,?,?,?)`,
    [
      position,
      description,
      requirements,
      salary,
      maxCandidateNumber,
      created_at,
      updated_at,
    ],
    (err, results) => {
      if (err) throw err;

      res.json({
        message: "Job created successfully",
        data: results.insertId,
      });
    }
  );
});
// @desc    Update specific job
// @route   PUT /api/v1/jobs/:id
// @access  Private/protected  (admin)
exports.updateJob = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { position, description, requirements, salary, maxCandidateNumber } =
    req.body;
  const updated_at = new Date();
  db.query(
    `UPDATE jobs SET position = ?, description = ?, requirements = ? , salary=?,
     maxCandidateNumber = ? ,updated_at = ? WHERE  id = ?`,
    [
      position,
      description,
      requirements,
      salary,
      maxCandidateNumber,
      updated_at,
      id,
    ],
    (err, results) => {
      if (err) throw err;
      res.json({ message: "Job updated successfully" });
    }
  );
});
// @desc    Delete specific job
// @route   DELETE /api/v1/jobs/:id
// @access  Private/protected  (admin)
exports.deleteJob = asyncHandler((req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Jobs WHERE id = ?", [id], (err, results) => {
    if (err) throw err;
    res.json({ message: "Job deleted successfully" });
  });
});
