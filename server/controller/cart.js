const checkAndUpdateCoupon = require("../midlleware/cheackCoupon");
const cartModel = require("../model/cart");
const CouponModel = require("../model/coupons");
const productModel = require("../model/product");
const redisClint = require("../redisClient");

const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cacheCart = `cart${userId}`;
  try {
    const existingUserCart = await cartModel.findOne({ userId });
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (existingUserCart) {
      const existingProduct = existingUserCart.products.find(
        (data) => data._id.toString() === productId.toString()
      );

      if (existingProduct) {
        if (existingProduct.quantity >= product.quantity) {
          return res
            .status(400)
            .json({ message: "Not enough stock available for this product" });
        } else {
          existingProduct.quantity++;
          existingUserCart.total += product.discountPrice;

          // Check if applied coupon is still valid
          await checkAndUpdateCoupon(existingUserCart, cacheCart);
        }
      } else {
        existingUserCart.products.push({
          _id: productId,
          quantity: 1,
        });
        existingUserCart.total += product.discountPrice;

        // Check if applied coupon is still valid
        await checkAndUpdateCoupon(existingUserCart, cacheCart);
      }

      await existingUserCart.save();
      await existingUserCart.populate("products._id");
      await redisClint.setEx(cacheCart, 3600, JSON.stringify(existingUserCart));

      return res
        .status(200)
        .json({ message: "Product added to cart", existingUserCart });
    } else {
      const newProduct = { _id: productId, quantity: 1 };
      const total = product.discountPrice;
      const newUserCart = new cartModel({
        userId,
        products: [newProduct],
        total,
      });

      await newUserCart.save();
      await newUserCart.populate("products._id");
      await redisClint.setEx(cacheCart, 3600, JSON.stringify(newUserCart));

      return res
        .status(200)
        .json({ message: "Product added to cart", newUserCart });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCart = async (req, res) => {
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;
  try {
    const data = await redisClint.get(cacheCart);
    if (data !== null) {
      return res
        .status(200)
        .json({ message: "Products resived", cartProduct: JSON.parse(data) });
    }

    const cartProduct = await cartModel
      .findOne({ userId })
      .populate("products._id");

    await redisClint.setEx(cacheCart, 3600, JSON.stringify(cartProduct));

    return res.status(200).json({ message: "Products resived", cartProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const Quantity = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const cacheCart = `cart${userId}`;

  try {
    const cart = await cartModel.findOne({ userId }).populate("products._id");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (data) => data._id._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const oldQuantity = cart.products[productIndex].quantity;
    cart.products[productIndex].quantity = quantity;

    cart.total +=
      (quantity - oldQuantity) * cart.products[productIndex]._id.discountPrice;

    // Check if applied coupon is still valid
    await checkAndUpdateCoupon(cart, cacheCart);

    await cart.save();
    await redisClint.setEx(cacheCart, 3600, JSON.stringify(cart));

    res.status(200).json({ message: "Quantity updated successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;

  try {
    const userCart = await cartModel
      .findOne({ userId })
      .populate("products._id");

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = userCart.products.findIndex(
      (data) => data._id._id.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const product = userCart.products[productIndex];
    userCart.total -= product._id.discountPrice * product.quantity;
    userCart.products.splice(productIndex, 1);

    // Check and update coupon status
    await checkAndUpdateCoupon(userCart, cacheCart);

    await userCart.save();
    await redisClint.setEx(cacheCart, 3600, JSON.stringify(userCart));

    // Send response after all operations
    res
      .status(200)
      .json({ message: "Product removed from cart", cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//checkout display name and quan

const cartcheack = async (req, res) => {
  const userId = req.user._id;
  try {
    const cartProduct = await cartModel
      .findOne({ userId })
      .populate({ path: "products._id", select: "name" });

    // console.log(cartProduct);
    return res
      .status(200)
      .json({ message: "Products resived", cartProduct: cartProduct });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const cartCouponCheack = async (req, res) => {
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;

  try {
    const userCart = await cartModel
      .findOne({ userId })
      .populate("products._id");

    if (!userCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (!userCart.appliedCoupon) {
      // No coupon applied, return current cart
      console.log(userCart.total);
      return res
        .status(200)
        .json({ message: "No coupon applied", userCart, change: false });
    }

    const coupon = await CouponModel.findById(userCart.appliedCoupon);
    console.log(coupon.minOrderValue, userCart.total);

    // coupon.minOrderValue > userCart.total

    if (!coupon || !coupon.active || coupon.expiryDate < new Date()) {
      // Coupon is no longer valid
      userCart.appliedCoupon = undefined;
      userCart.appliedCouponDiscount = undefined;
      userCart.total = userCart.products.reduce((total, data) => {
        return total + data._id.discountPrice * data.quantity;
      }, 0);

      await userCart.save();
      await redisClint.setEx(cacheCart, 3600, JSON.stringify(userCart));

      return res
        .status(200)
        .json({ message: "Coupon removed from cart", userCart, change: true });
    }

    // Coupon is still valid, return current cart
    return res
      .status(200)
      .json({ message: "Coupon still valid", userCart, change: false });
  } catch (error) {
    console.error("Error in cartCouponCheack:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  Quantity,
  removeFromCart,
  cartcheack,
  cartCouponCheack,
};
