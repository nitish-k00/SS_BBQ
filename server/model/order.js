const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usersInfo",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      geolocation: {
        type: [Number],
        default: [0.0, 0.0],
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
    },
    payment: {
      paymentMethod: {
        type: String,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
    },
    deliveredTime: {
      type: String,
    },
    orderPicked: {
      name: { type: String },
      contact: { type: Number },
      status: { type: String },
      date: {
        type: Date,
      },
      Geolocation: {
        type: [Number],
        default: [0.0, 0.0],
        required: true,
      },
    },
    products: [
      {
        orderStatus: {
          type: String,
          enum: [
            "created",
            "confirmed",
            "prepared",
            "picked",
            "delivered",
            "cancelled",
          ],
          default: "created",
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    appliedCouponDiscount: {
      type: Number,
    },
    appliedCoupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupons",
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("Order", orderSchema);

module.exports = OrderModel;
