const express = require("express");
const router = express.Router();

router.post("/create-new-conversation", (req, res) => {
  res.status(200).json({
    success: true,
    conversation: { _id: "temp-conv-id", members: [] },
  });
});

router.get("/get-all-conversation-seller/:id", (req, res) => {
  res.status(200).json({ success: true, conversations: [] });
});

router.put("/update-last-message/:id", (req, res) => {
  res.status(200).json({ success: true, conversation: { _id: req.params.id } });
});

module.exports = router;
