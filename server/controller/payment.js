const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const Order = require("../model/order");
const userModel = require("../model/userModel");
const cartModel = require("../model/cart");
const redisClient = require("../redisClient");
const productModel = require("../model/product");
const CouponModel = require("../model/coupons");
const userCouponModel = require("../model/userCoupon");
const favouriteModel = require("../model/favourite");
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.PAYMENT_ID,
  key_secret: process.env.PAYMENT_KEY,
});

const order = async (req, res) => {
  console.log("called");
  const userId = req.user._id;
  console.log(userId);

  const options = {
    amount: req.body.amount * 100, // amount in paise
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
  };

  try {
    const response = await razorpay.orders.create(options);
    const usersInfo = await userModel.findById(userId);
    const userCart = await cartModel.findOne({ userId });
    console.log(userCart.products[1]);
    const products = userCart.products.map((data) => ({
      product: data._id,
      quantity: data.quantity,
      orderStatus: "created",
    }));

    const newOrder = new Order({
      orderId: response.id,
      customer: {
        userId: userId,
        name: usersInfo.name,
        email: usersInfo.email,
        address: usersInfo.MapAddress,
        geolocation: [usersInfo.latitude, usersInfo.longitude],
        contact: usersInfo.phoneNo,
      },
      total: req.body.amount,
      payment: {
        status: "pending",
      },
      deliveredTime: null,
      products: products,
      appliedCouponDiscount: userCart.appliedCouponDiscount || null,
      appliedCoupon: userCart.appliedCoupon || null,
    });
    await newOrder.save();
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Not able to create order. Please try again!");
  }
};

const paymentCapture = async (req, res) => {
  const secret_key = process.env.PAYMENT_KEY;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const shasum = crypto.createHmac("sha256", secret_key);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest("hex");

  if (digest !== razorpay_signature) {
    return res.status(400).send("Invalid signature");
  }

  try {
    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    const order = await Order.findOne({ orderId: razorpay_order_id });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.payment.status === "completed") {
      return res
        .status(400)
        .json({ error: "Payment already captured for this order" });
    }

    // Reduce product quantities based on user's cart
    const userCart = await cartModel.findOne({ userId: order.customer.userId });

    for (const item of userCart.products) {
      const product = await productModel.findById(item._id);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.quantity > 0) {
        product.quantity -= item.quantity;
        if (product.quantity <= 0) {
          product.quantity = 0;
          product.available = false;
        }
      }
      await product.save();
    }

    const allProducts = await productModel
      .find()
      .populate("category")
      .sort({ _id: -1 });
    await redisClient.setEx("products", 3600, JSON.stringify(allProducts));

    const userId = order.customer.userId;
    const cacheKeyFav = `fav${userId}`;
    const favProduct = await favouriteModel
      .findOne({ userId })
      .populate("products");
    if (favProduct) {
      await redisClient.setEx(
        cacheKeyFav,
        3600,
        JSON.stringify(favProduct.products)
      );
    }

    // Update order payment status and method
    order.payment.status = "completed";
    order.payment.paymentMethod = paymentDetails.method;
    order.orderPicked.status = "created";
    await order.save();

    if (userCart.appliedCoupon) {
      const Coupons = await CouponModel.findById(userCart.appliedCoupon);
      Coupons.usedBy = order.customer.userId;
      Coupons.uses += 1;
      await Coupons.save();

      const userCoupon = await userCouponModel.findOne({
        userId: order.customer.userId,
      });

      if (userCoupon) {
        userCoupon.usedCoupons.push(userCart.appliedCoupon);
        await userCoupon.save();
      } else {
        const newuserCoupon = new userCouponModel({
          userId: order.customer.userId,
          usedCoupons: [userCart.appliedCoupon],
        });
        await newuserCoupon.save();
      }
    }

    await cartModel.findOneAndDelete({ userId: order.customer.userId });
    await redisClient.del(`cart${order.customer.userId}`);

    const products = await productModel
      .find()
      .populate("category")
      .sort({ _id: -1 });

    // Cache the products
    await redisClient.setEx("products", 3600, JSON.stringify(products));

    res.status(200).json({ status: "ok", order });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ error: "Database update failed" });
  }
};

module.exports = { order, paymentCapture };
