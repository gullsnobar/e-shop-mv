const express = require("express");
const router = express.Router();

router.get("/get-all-products", (req, res) => {
  res.status(200).json({ success: true, products: [] });
});

module.exports = router;
