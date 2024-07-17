import axios from "axios";
import { toast } from "react-toastify";
import handle401Error from "../../middleware/logoutExp";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const profileInfo = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/profileInfo`);
    //console.log(data);
    return data.userData;
  } catch (error) {
    //console.log(error);
    await handle401Error(error);
    return;
  }
};

const editProfile = async (updatedData) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/editProfile`,
      updatedData
    );
    toast.success(data?.message);
    return data.userData;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error, "ss");
  }
};

const logout = async () => {
  try {
    await axios.post(`${BASE_URL}/auth/logout`);
  } catch (error) {
    //console.log(error);
    return;
  }
};

const getProduct = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/allProduct`);
    return data.product;
  } catch (error) {
    // //console.log(error.response?.data?.message);
    return [];
  }
};

const singleProduct = async (id) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/singleProduct/${id}`);
    return data.product;
  } catch (error) {
    return error.response?.data?.message;
  }
};

const getCategory = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/allCategory`);
    return data.categories;
  } catch (error) {
    // //console.log(error.response?.data?.message);
    return [];
  }
};

const relatedProducted = async (name) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/cateProduct/${name}`);
    return data.CategoryProduct;
  } catch (error) {}
};

const specialProduct = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/specialProduct`);
    return data.product;
  } catch (error) {
    return [];
  }
};

const addToCart = async (productId) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/addtocart`, {
      productId,
    });
    toast.success(data?.message);
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
  }
};

const getCart = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/carts`);
    // //console.log(data.cartProduct);
    return data.cartProduct;
  } catch (error) {
    // await handle401Error(error);
    //  //console.log(error);
    return [];
  }
};

const getCartcheack = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/cartcheack`);
    return data.cartProduct;
  } catch (error) {
    await handle401Error(error);
    return [];
  }
};

const updateQuantatiy = async (productId, quantity) => {
  try {
    const { data } = await axios.put(`${BASE_URL}/auth/updateQuantatiy`, {
      productId,
      quantity,
    });
    toast.success(data?.message);
    return data.cart;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
  }
};

const removeFromCart = async (productId) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/auth/removeFromCart/${productId}`
    );
    toast.success(data?.message);
    return data.cart;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
  }
};

const CouponCartcheck = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/cartCouponCheack`);
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
  }
};

const getFav = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/fav`);
    return data.favProduct;
  } catch (error) {
    await handle401Error(error);
    return [];
  }
};

const addAndRemoveFav = async (productId) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/addAndRemoveFav/${productId}`
    );
    toast.success(data?.message);
    //  //console.log(data);
    return data.favProduct;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
    //   //console.log(error);
  }
};

const getFavColours = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/favColour`);
    return data.favProduct;
  } catch (error) {
    // await handle401Error(error);
    return [];
  }
};

const getAdressMapApi = async (lat, lng) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/auth/maps-addres-api?lat=${lat}&lon=${lng}`
    );
    //  //console.log(data);
    return data;
  } catch (error) {
    await handle401Error(error);
    //  //console.log(error);
    return [];
  }
};

const getAllCoupon = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/getAllCouponUser`);
    return data;
  } catch (error) {
    // await handle401Error(error);
    // //console.log(error);
    return [];
  }
};

const applyCoupon = async (code) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/validateCoupans`, {
      code,
    });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);

    return [];
  }
};

const removeCoupon = async (code) => {
  try {
    const { data } = await axios.delete(`${BASE_URL}/auth/removeCoupons`, {
      data: { code },
    });
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);

    return [];
  }
};

const userOrders = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/auth/userOrders`);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);

    return [];
  }
};

export {
  profileInfo,
  logout,
  editProfile,
  getProduct,
  getCategory,
  singleProduct,
  relatedProducted,
  specialProduct,
  addToCart,
  getCart,
  getCartcheack,
  updateQuantatiy,
  removeFromCart,
  getFav,
  addAndRemoveFav,
  getFavColours,
  getAdressMapApi,
  getAllCoupon,
  applyCoupon,
  removeCoupon,
  CouponCartcheck,
  userOrders,
};
