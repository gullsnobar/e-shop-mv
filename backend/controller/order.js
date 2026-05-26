const express = require("express");
const router = express.Router();

// get all orders of user
router.get("/get-all-orders/:userId", (req, res) => {
  res.status(200).json({ success: true, orders: [] });
});

// get all orders of shop
router.get("/get-all-orders-shop/:shopId", (req, res) => {
  res.status(200).json({ success: true, orders: [] });
});

// update order status
router.put("/update-order-status/:id", (req, res) => {
  res.status(200).json({ success: true, message: "Order status updated" });
});

// order refund success
router.put("/order-refund-success/:id", (req, res) => {
  res.status(200).json({ success: true, message: "Refund processed" });
});

module.exports = router;
