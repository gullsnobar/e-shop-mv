const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      name: {
        type: String,
        required: true,
      },
      images: {
        type: Array,
        default: [],
      },
      qty: {
        type: Number,
        required: true,
        default: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      discountPrice: {
        type: Number,
        default: 0,
      },
      shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
      },
    },
  ],
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    type: {
      type: String,
      enum: ["COD", "Stripe", "PayPal"],
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed", "Refunded"],
    },
    id: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },
  deliveredAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    default: "Processing",
    enum: ["Processing", "Transferred to delivery partner", "Shipped", "Delivered", "Cancelled", "Refund"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
