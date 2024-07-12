const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const favouriteModel = mongoose.model("favourites", favouriteSchema);

module.exports = favouriteModel;
