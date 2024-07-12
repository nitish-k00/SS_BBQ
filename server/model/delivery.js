const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverySchema = new Schema(
  {
    orderIdDeliveryId: {
      type: String,
      required: true,
      unique: true,
    },
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usersInfo",
    },
    status: { type: String },
    deliverdTime: { type: Date },
    pickedTime: { type: Date },
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
      geolocation: {
        type: [Number],
        required: true,
      },
      contact: {
        type: String,
        required: true,
      },
    },
    total: {
      type: Number,
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const deliveryModel = mongoose.model("delivery", deliverySchema);

module.exports = deliveryModel;
