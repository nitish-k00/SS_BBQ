import axios from "axios";
import { toast } from "react-toastify";
import handle401Error from "../../middleware/logoutExp";

const backEndUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

export const getCategory = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/allCategory`);
    return data.categories;
  } catch (error) {
    await handle401Error(error);
    return error.response?.data?.message;
  }
};

export const createCategory = async (newCategories) => {
  try {
    const { data } = await axios.post(`${backEndUrl}/auth/createCategory`, {
      name: newCategories,
    });
    toast.success(data?.message);
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
  }
};

export const editCategorys = async (updateCategories) => {
  try {
    const { data } = await axios.put(
      `${backEndUrl}/auth/updateCategory/${updateCategories._id}`,
      {
        name: updateCategories.name,
      }
    );
    return toast.success(data?.message);
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    return;
  }
};

export const deleteCategory = async (Categories) => {
  try {
    const { data } = await axios.delete(
      `${backEndUrl}/auth/deleteCategory/${Categories._id}`
    );
    return toast.success(data?.message);
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    return;
  }
};

///

export const createProduct = async (newProduct) => {
  try {
    const { data } = await axios.post(
      `${backEndUrl}/auth/createProduct`,
      newProduct
    );
    toast.success(data?.message);
    // //console.log(data.product, "create");
    return data.product;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);

    // //console.log(error);
  }
};

export const getProduct = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/allProduct`);
    return data.product;
  } catch (error) {
    await handle401Error(error);
    return error.response?.data?.message;
  }
};

export const editProduct = async (updateProduct) => {
  try {
    const { data } = await axios.put(
      `${backEndUrl}/auth/updateProduct/${updateProduct._id}`,
      updateProduct
    );

    toast.success(data?.message);
    return data.product;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    // //console.log(error);
    return;
  }
};

export const deleteProduct = async (Product) => {
  try {
    const { data } = await axios.delete(
      `${backEndUrl}/auth/deleteProduct/${Product}`
    );
    toast.success(data?.message);
    // //console.log(data.product, "delete");
    return data.product;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    return;
  }
};

export const createCoupon = async (newCoupon) => {
  try {
    const { data } = await axios.post(`${backEndUrl}/auth/createCoupons`, {
      newCoupon,
    });
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    // //console.log(error.response?.data);
    return;
  }
};

export const editCoupon = async (editCoupon) => {
  try {
    const { data } = await axios.put(`${backEndUrl}/auth/editCoupon`, {
      editCoupon,
    });
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    // //console.log(error.response?.data);
    return;
  }
};

export const deleteCoupon = async (couponId) => {
  try {
    const { data } = await axios.delete(`${backEndUrl}/auth/deleteCoupons`, {
      data: { couponId },
    });
    toast.success(data?.message);
    return data.Coupons;
  } catch (error) {
    toast.error(error.response?.data?.message);
    await handle401Error(error);
    // //console.log(error.response?.data);
    return;
  }
};

export const allCoupon = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/allCoupans`);
    return data.coupons;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const allOrders = async (currentPage) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/allOrders?page=${currentPage}`
    );
    return data;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const allTodayOrders = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/todayOrders`);
    return data.orders;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const singleOrders = async (orderId) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/singleOrder/${orderId}`
    );
    return data;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const deliveryStatusChange = async (orderId, status, productId) => {
  try {
    const { data } = await axios.put(
      `${backEndUrl}/auth/deliveryStatusChange/${orderId}`,
      { status, productId }
    );
    return data;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const GetAllUsers = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/GetAllUsers`);
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const GetSingleUsers = async (userId) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/GetSingleUsers/${userId}`
    );
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const GetDeliverySingleUsers = async (userId) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/GetDeliverySingleUsers/${userId}`
    );
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const userOrders = async (userId) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/GetSingleUsersOrders/${userId}`
    );
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);

    return [];
  }
};

export const CouponCartcheck = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/cartCouponCheack`);
    toast.success(data?.message);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    await handle401Error(error);
  }
};

export const allOrdersDate = async (currentDate) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/allOrdersDate?date=${currentDate}`
    );
    return data;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const ordersTodayData = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/ordersTodayData`);
    return data;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const ProductNameQuantity = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/ProductNameQuantity`);
    return data.product;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error.response?.data);
  }
};

export const deliveryManInfo = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/delivery-Man`);
    return data.deliveryMan;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error);
  }
};

export const deliveryManOrders = async (deliveryId) => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/delivery-Man-info/${deliveryId}`
    );
    return data.deliveryMan;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error);
  }
};

export const GetDeliveryRegisteredUsers = async () => {
  try {
    const { data } = await axios.get(
      `${backEndUrl}/auth/GetDeliveryRegisteredUsers`
    );
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error);
  }
};

export const deliveryManRegisterAccept = async (deliveryId) => {
  // //console.log(deliveryId);
  try {
    const { data } = await axios.put(
      `${backEndUrl}/auth/GetDeliveryResisterAccepect/${deliveryId}`
    );
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error);
  }
};

export const DeliveryManBlockUnBlock = async (deliveryId) => {
  try {
    const { data } = await axios.put(
      `${backEndUrl}/auth/DeliveryManBlockUnBlock/${deliveryId}`
    );
    return data.users;
  } catch (error) {
    await handle401Error(error);
    // //console.log(error);
  }
};
