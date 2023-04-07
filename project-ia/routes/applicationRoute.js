const express = require("express");
const authServices = require("../services/authServices");
const {
  sendApllication,
  getApllications,
  getApllication,
  updateApllication,
  deleteApllication,
  acceptApllication,
  rejectApllication,
} = require("../services/applicationServices");

const router = express.Router();

router
  .route("/")
  .get(
    authServices.protect,
    authServices.allowedTo("applicant", "admin"),
    getApllications
  )
  .post(
    authServices.protect,
    authServices.allowedTo("applicant"),
    sendApllication
  );

router
  .route("/:id")
  .get(
    authServices.protect,
    authServices.allowedTo("applicant", "admin"),
    getApllication
  )
  .put(
    authServices.protect,
    authServices.allowedTo("applicant"),
    updateApllication
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("applicant"),
    deleteApllication
  );
router
  .route("/:id/accept")
  .put(
    authServices.protect,
    authServices.allowedTo("applicant"),
    acceptApllication
  );
router
  .route("/:id/reject")
  .put(
    authServices.protect,
    authServices.allowedTo("applicant"),
    rejectApllication
  );
module.exports = router;
