const cartModel = require("../model/cart");
const CouponModel = require("../model/coupons");
const userCouponModel = require("../model/userCoupon");
const redisClient = require("../redisClient");

const createCoupon = async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    expiryDate,
    maxUses,
    uses,
    active,
    minOrderValue,
  } = req.body.newCoupon;

  try {
    const existingCoupon = await CouponModel.findOne({ code });

    if (existingCoupon) {
      return res.status(500).json({ message: "Coupon allready exists" });
    }

    const newCoupon = new CouponModel({
      code: code,
      description: description,
      discountType: discountType,
      discountValue: discountValue,
      expiryDate: expiryDate,
      maxUses: maxUses,
      uses: uses,
      active: active,
      minOrderValue: minOrderValue,
    });
    await newCoupon.save();

    return res
      .status(200)
      .json({ message: "Coupon created sucessfully", Coupons: newCoupon });
  } catch (error) {
    console.log(error);
  }
};

const editCoupon = async (req, res) => {
  const {
    _id,
    code,
    description,
    discountType,
    discountValue,
    expiryDate,
    maxUses,
    uses,
    active,
    minOrderValue,
  } = req.body.editCoupon;

  try {
    const updatedCoupon = await CouponModel.findByIdAndUpdate(
      _id,
      {
        code: code,
        description: description,
        discountType: discountType,
        discountValue: discountValue,
        expiryDate: expiryDate,
        maxUses: maxUses,
        uses: uses,
        active: active,
        minOrderValue: minOrderValue,
      },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    return res
      .status(200)
      .json({ message: "Coupon edited sucessfully", Coupons: updatedCoupon });
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCoupon = async (req, res) => {
  const couponId = req.body.couponId;

  try {
    const deletedCoupon = await CouponModel.findByIdAndDelete(couponId);

    if (!deletedCoupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }

    const cartsWithDeletedCoupons = await cartModel
      .find({
        appliedCoupon: couponId,
      })
      .populate("products._id");

    await Promise.all(
      cartsWithDeletedCoupons.map(async (userCart) => {
        userCart.total = userCart.products.reduce((total, data) => {
          return total + data._id.discountPrice * data.quantity;
        }, 0);
        userCart.appliedCoupon = undefined;
        userCart.appliedCouponDiscount = undefined;
        await userCart.save();
        const cacheCart = `cart${userCart.userId}`;
        await redisClient.setEx(cacheCart, 3600, JSON.stringify(userCart));
      })
    );

    return res
      .status(200)
      .json({ message: "Coupon deleted sucessfully", Coupons: deletedCoupon });
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCoupon = async (req, res) => {
  try {
    const Coupons = await CouponModel.find();
    console.log(Coupons);
    return res.status(200).json({ coupons: Coupons });
  } catch (error) {
    console.log(error);
  }
};

const getAllCouponUser = async (req, res) => {
  const userId = req.user?._id;
  try {
    const userUsedCoupons = (await userCouponModel.findOne({ userId })) || [];

    console.log(userUsedCoupons, "f");
    const Coupons = await CouponModel.find({ active: true });

    if (userUsedCoupons.usedCoupons?.length > 0) {
      const availableCoupons = Coupons.filter(
        (coupons) => !userUsedCoupons.usedCoupons.includes(coupons._id)
      );

      return res.status(200).json({ coupons: availableCoupons });
    } else {
      return res.status(200).json({ coupons: Coupons });
    }
  } catch (error) {
    console.log(error);
  }
};
// Validate a coupon

const ValidateCoupon = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;

  console.log(code);

  try {
    const coupon = await CouponModel.findOne({ code, active: true });
    const userCart = await cartModel
      .findOne({
        userId,
      })
      .populate("products._id");

    if (!userCart) {
      return res.status(404).send({ message: "user cart not found" });
    }

    if (!coupon) {
      return res.status(404).send({ message: "Coupon not found or inactive" });
    }

    if (coupon.expiryDate < new Date()) {
      coupon.active = false;
      await coupon.save();
      return res.status(400).send({ message: "Coupon expired" });
    }

    if (coupon.uses >= coupon.maxUses) {
      return res.status(400).send({ message: "Coupon usage limit reached" });
    }

    if (coupon.minOrderValue > userCart.total) {
      return res.status(400).send({
        message: `Minimum order value should be ${coupon.minOrderValue}`,
      });
    }

    if (coupon.usedBy.includes(userId)) {
      return res
        .status(400)
        .send({ message: "Coupon already used by this user" });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (coupon.discountValue / 100) * userCart.total;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountValue;
    }
    const cartTotal = userCart.products.reduce((total, data) => {
      return total + data._id.discountPrice * data.quantity;
    }, 0);

    discount = parseFloat(discount.toFixed(2));
    userCart.total = cartTotal - discount;
    userCart.appliedCouponDiscount = discount;
    userCart.appliedCoupon = coupon._id;

    await userCart.save();

    await redisClient.setEx(cacheCart, 3600, JSON.stringify(userCart));

    res.status(200).send({ message: "Coupon applied successfully", userCart });
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const removeCoupon = async (req, res) => {
  const userId = req.user._id;
  const cacheCart = `cart${userId}`;
  try {
    const userCart = await cartModel
      .findOne({ userId })
      .populate("products._id");

    if (!userCart) {
      return res.status(404).send({ message: "User cart not found" });
    }

    // Recalculate the cart total
    userCart.total = userCart.products.reduce((total, data) => {
      return total + data._id.discountPrice * data.quantity;
    }, 0);

    // Remove the applied coupon
    userCart.appliedCoupon = undefined;
    userCart.appliedCouponDiscount = undefined;
    await userCart.save();
    await redisClient.setEx(cacheCart, 3600, JSON.stringify(userCart));

    res.status(200).send({ message: "Coupon removed successfully", userCart });
  } catch (error) {
    res.status(500).send({ message: "Internal server error", error });
    console.error(error);
  }
};

module.exports = {
  createCoupon,
  getAllCoupon,
  ValidateCoupon,
  removeCoupon,
  getAllCouponUser,
  editCoupon,
  deleteCoupon,
};
