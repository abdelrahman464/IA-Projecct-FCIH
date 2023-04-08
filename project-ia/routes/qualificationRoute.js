const express = require("express");

const authServices = require("../services/authServices");
const {
  getQualifications,
  getQualification,
  createQualification,
  updateQualification,
  deleteQualification,
  // searchInJobs,
} = require("../services/qualificationServices");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("applicant", "admin"),
    getQualifications
  )
  .post(
    authServices.protect,
    authServices.allowedTo("admin"),
    createQualification
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("applicant", "admin"),
    getQualification
  )
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    updateQualification
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteQualification
  );
// router
//   .route("/search")
//   .get(
//     authServices.protect,
//     authServices.allowedTo("applicant"),
//     searchInJobs,
//     (req, res) => {
//       const filteredRecords = res.locals.filteredRecords;
//       res.render("search", { results: filteredRecords });
//     }
//   );
module.exports = router;
