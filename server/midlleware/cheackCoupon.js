const CouponModel = require("../model/coupons");
const redisClint = require("../redisClient");

const checkAndUpdateCoupon = async (userCart, cacheCart) => {
  console.log(userCart.total);
  if (!userCart.appliedCoupon) return; // No coupon applied, nothing to check

  const coupon = await CouponModel.findById(userCart.appliedCoupon);

  if (
    !coupon ||
    !coupon.active ||
    coupon.expiryDate < new Date() ||
    coupon.minOrderValue > userCart.total
  ) {
    // Coupon is no longer valid
    userCart.appliedCoupon = undefined;
    userCart.appliedCouponDiscount = undefined;
    userCart.total = userCart.products.reduce((total, data) => {
      return total + data._id.discountPrice * data.quantity;
    }, 0);

    await userCart.save();
    await redisClint.setEx(cacheCart, 3600, JSON.stringify(userCart));

    return { couponRemoved: true, cart: userCart }; // Indicate coupon removed
  }

  // Coupon is still valid, no changes needed
  return { couponRemoved: false };
};

module.exports = checkAndUpdateCoupon;
