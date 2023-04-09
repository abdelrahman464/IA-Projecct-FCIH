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
  getLoggedUserApllications,
} = require("../services/applicationServices");

const router = express.Router();

router
  .route("/")
  .get(authServices.protect, authServices.allowedTo("admin"), getApllications)
  .post(
    authServices.protect,
    authServices.allowedTo("applicant"),
    sendApllication
  );
router
  .route("/myapplications")
  .get(
    authServices.protect,
    authServices.allowedTo("applicant"),
    getLoggedUserApllications
  );
router
  .route("/:id")
  .get(authServices.protect, authServices.allowedTo("admin"), getApllication)
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
    authServices.allowedTo("admin"),
    acceptApllication
  );
router
  .route("/:id/reject")
  .put(
    authServices.protect,
    authServices.allowedTo("admin"),
    rejectApllication
  );

module.exports = router;
