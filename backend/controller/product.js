const express = require("express");
const router = express.Router();

router.get("/get-all-products", (req, res) => {
  res.status(200).json({ success: true, products: [] });
});

router.get("/get-all-products-shop/:id", (req, res) => {
  res.status(200).json({ success: true, products: [] });
});

router.delete("/delete-shop-product/:id", (req, res) => {
  res.status(200).json({ success: true, message: "Product deleted" });
});

router.post("/create-product", (req, res) => {
  res.status(200).json({ success: true, products: [] });
});

module.exports = router;
