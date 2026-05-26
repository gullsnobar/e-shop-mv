const express = require("express");
const router = express.Router();

router.delete("/delete-coupon/:id", (req, res) => {
  res.status(200).json({ success: true, message: "Coupon deleted" });
});

router.post("/create-coupon-code", (req, res) => {
  res.status(200).json({ success: true, message: "Coupon created" });
});

module.exports = router;
