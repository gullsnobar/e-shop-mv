const express = require("express");
const router = express.Router();

router.get("/get-all-messages/:id", (req, res) => {
  res.status(200).json({ success: true, messages: [] });
});

router.post("/create-new-message", (req, res) => {
  res.status(200).json({
    success: true,
    message: { _id: "temp-msg-id", text: req.body.text || "" },
  });
});

module.exports = router;
