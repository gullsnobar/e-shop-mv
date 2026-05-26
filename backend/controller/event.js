const express = require("express");
const router = express.Router();

router.get("/get-all-events", (req, res) => {
  res.status(200).json({ success: true, events: [] });
});

router.get("/get-all-events/:id", (req, res) => {
  res.status(200).json({ success: true, events: [] });
});

router.delete("/delete-shop-event/:id", (req, res) => {
  res.status(200).json({ success: true, message: "Event deleted" });
});

module.exports = router;
