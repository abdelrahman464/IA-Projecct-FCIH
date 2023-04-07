const express = require("express");

const {
  createJobValidator,
  updateJobValidator,
} = require("../utils/validators/jobValidator");
const authServices = require("../services/authServices");
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../services/jobServices");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("applicant", "admin"), getJobs)
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    createJobValidator,
    createJob
  );

router
  .route("/:id")
  .get(authServices.protect, authServices.allowedTo("applicant", "admin"), getJob)
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateJobValidator,
    updateJob
  )
  .delete(authServices.protect, authServices.allowedTo("admin"), deleteJob);

module.exports = router;
