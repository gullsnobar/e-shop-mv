const express = require("express");
const router = express.Router();
const Order = require("../model/order");
const User = require("../model/user");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");

// =========================
// CASH ON DELIVERY (COD)
// =========================
router.post(
  "/create-order",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("=== CREATE ORDER (COD) ===");
      console.log("Request body:", req.body);

      const { cart, shippingAddress, totalPrice, shippingPrice, discountPrice, paymentInfo } = req.body;

      if (!cart || cart.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
      }
      if (!shippingAddress) {
        return next(new ErrorHandler("Shipping address is required", 400));
      }

      const itemsPrice = cart.reduce((acc, item) => acc + item.qty * (item.discountPrice || item.price || 0), 0);

      const order = await Order.create({
        cart,
        shippingAddress,
        user: req.user._id,
        paymentInfo: {
          type: paymentInfo?.type || "COD",
          status: "Pending",
        },
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        discountPrice: discountPrice || 0,
        totalPrice: totalPrice || itemsPrice + (shippingPrice || 0) - (discountPrice || 0),
        status: "Processing",
      });

      console.log("Order created:", order._id);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      console.log("CREATE ORDER ERROR:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =========================
// STRIPE PAYMENT
// =========================
router.post(
  "/create-stripe-order",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("=== CREATE STRIPE ORDER ===");
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const { cart, shippingAddress, totalPrice, shippingPrice, discountPrice, successUrl, cancelUrl } = req.body;

      if (!cart || cart.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
      }
      if (!shippingAddress) {
        return next(new ErrorHandler("Shipping address is required", 400));
      }

      // Build line items for Stripe
      const lineItems = cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: item.images?.map((img) => img.url) || [],
          },
          unit_amount: Math.round((item.discountPrice || item.price || 0) * 100),
        },
        quantity: item.qty || 1,
      }));

      // Add shipping as line item if applicable
      if (shippingPrice && shippingPrice > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Shipping",
            },
            unit_amount: Math.round(shippingPrice * 100),
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: successUrl || `${process.env.FRONTEND_URL}/order/success/{CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment`,
        metadata: {
          userId: req.user._id.toString(),
          cart: JSON.stringify(cart),
          shippingAddress: JSON.stringify(shippingAddress),
          shippingPrice: String(shippingPrice || 0),
          discountPrice: String(discountPrice || 0),
          totalPrice: String(totalPrice || 0),
        },
      });

      console.log("Stripe session created:", session.id);

      res.status(200).json({
        success: true,
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.log("STRIPE ERROR:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Stripe webhook or verify endpoint
router.post(
  "/verify-stripe-payment",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
      const { sessionId } = req.body;

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return next(new ErrorHandler("Payment not completed", 400));
      }

      const cart = JSON.parse(session.metadata.cart);
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const shippingPrice = Number(session.metadata.shippingPrice || 0);
      const discountPrice = Number(session.metadata.discountPrice || 0);
      const totalPrice = Number(session.metadata.totalPrice || 0);
      const userId = session.metadata.userId;

      // Check if order already exists for this session
      let order = await Order.findOne({ "paymentInfo.id": sessionId });
      if (order) {
        return res.status(200).json({ success: true, order });
      }

      const itemsPrice = cart.reduce((acc, item) => acc + item.qty * (item.discountPrice || item.price || 0), 0);

      order = await Order.create({
        cart,
        shippingAddress,
        user: userId,
        paymentInfo: {
          type: "Stripe",
          status: "Paid",
          id: sessionId,
        },
        itemsPrice,
        shippingPrice,
        discountPrice,
        totalPrice: totalPrice || itemsPrice + shippingPrice - discountPrice,
        paidAt: new Date(),
        status: "Processing",
      });

      console.log("Stripe order saved:", order._id);

      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      console.log("VERIFY STRIPE ERROR:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =========================
// PAYPAL PAYMENT
// =========================
const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_MODE === "live"
    ? "https://api.paypal.com"
    : "https://api.sandbox.paypal.com";

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};

router.post(
  "/create-paypal-order",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("=== CREATE PAYPAL ORDER ===");
      const { cart, shippingAddress, totalPrice, shippingPrice, discountPrice, successUrl, cancelUrl } = req.body;

      if (!cart || cart.length === 0) {
        return next(new ErrorHandler("Cart is empty", 400));
      }

      const itemsPrice = cart.reduce((acc, item) => acc + item.qty * (item.discountPrice || item.price || 0), 0);
      const finalTotal = totalPrice || itemsPrice + (shippingPrice || 0) - (discountPrice || 0);

      const accessToken = await getPayPalAccessToken();
      const baseUrl = process.env.PAYPAL_MODE === "live"
        ? "https://api.paypal.com"
        : "https://api.sandbox.paypal.com";

      const frontendOrigin = successUrl ? successUrl.replace(/\/order\/success.*/, "") : (process.env.FRONTEND_URL || "http://localhost:5173");

      const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: finalTotal.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: itemsPrice.toFixed(2),
                  },
                  shipping: {
                    currency_code: "USD",
                    value: (shippingPrice || 0).toFixed(2),
                  },
                  discount: {
                    currency_code: "USD",
                    value: (discountPrice || 0).toFixed(2),
                  },
                },
              },
              items: cart.map((item) => ({
                name: item.name.substring(0, 127),
                unit_amount: {
                  currency_code: "USD",
                  value: (item.discountPrice || item.price || 0).toFixed(2),
                },
                quantity: String(item.qty || 1),
              })),
            },
          ],
          application_context: {
            return_url: `${frontendOrigin}/order/success/paypal`,
            cancel_url: cancelUrl || `${frontendOrigin}/payment`,
          },
        }),
      });

      const orderData = await response.json();
      console.log("PayPal order created:", orderData.id);

      // Save pending order in DB
      const itemsPriceCalc = cart.reduce((acc, item) => acc + item.qty * (item.discountPrice || item.price || 0), 0);
      const dbOrder = await Order.create({
        cart,
        shippingAddress,
        user: req.user._id,
        paymentInfo: {
          type: "PayPal",
          status: "Pending",
          id: orderData.id,
        },
        itemsPrice: itemsPriceCalc,
        shippingPrice: shippingPrice || 0,
        discountPrice: discountPrice || 0,
        totalPrice: finalTotal,
        status: "Processing",
      });

      const approvalLink = orderData.links.find((link) => link.rel === "approve");

      res.status(200).json({
        success: true,
        orderId: orderData.id,
        dbOrderId: dbOrder._id,
        approvalUrl: approvalLink?.href,
      });
    } catch (error) {
      console.log("PAYPAL CREATE ERROR:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.post(
  "/capture-paypal-order",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("=== CAPTURE PAYPAL ORDER ===");
      const { orderId } = req.body;

      const accessToken = await getPayPalAccessToken();
      const baseUrl = process.env.PAYPAL_MODE === "live"
        ? "https://api.paypal.com"
        : "https://api.sandbox.paypal.com";

      const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const captureData = await response.json();
      console.log("PayPal capture status:", captureData.status);

      if (captureData.status !== "COMPLETED") {
        return next(new ErrorHandler("Payment not completed", 400));
      }

      // Update order in DB
      const order = await Order.findOne({ "paymentInfo.id": orderId });
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      order.paymentInfo.status = "Paid";
      order.paidAt = new Date();
      await order.save();

      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      console.log("PAYPAL CAPTURE ERROR:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// =========================
// ORDER MANAGEMENT
// =========================

// get all orders of user
router.get(
  "/get-all-orders/:userId",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ user: req.params.userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get all orders of shop
router.get(
  "/get-all-orders-shop/:shopId",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await Order.find({ "cart.shopId": req.params.shopId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, orders });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// get single order by id
router.get(
  "/get-order/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id).populate("user", "name email");
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      res.status(200).json({ success: true, order });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// update order status
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      order.status = req.body.status;
      if (req.body.status === "Delivered") {
        order.deliveredAt = new Date();
      }
      await order.save();

      res.status(200).json({ success: true, order });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// order refund request
router.put(
  "/order-refund/:id",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      order.status = "Refund";
      await order.save();

      res.status(200).json({ success: true, order, message: "Refund request sent" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// order refund success (admin/seller)
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      order.status = "Refund Success";
      order.paymentInfo.status = "Refunded";
      await order.save();

      res.status(200).json({ success: true, message: "Refund processed successfully" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
