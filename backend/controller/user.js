const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const { createUser, loginUser } = require("../controllers/user.controller");

const router = express.Router();

router.post("/create-user", upload.single("file"), catchAsyncErrors(createUser));
router.post("/login-user", catchAsyncErrors(loginUser));

module.exports = router;