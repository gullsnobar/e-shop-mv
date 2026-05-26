const express = require("express");
const router = express.Router();

router.post("/create-withdraw-request", (req, res) => {
  res.status(200).json({ success: true, message: "Withdraw request created" });
});

module.exports = router;
