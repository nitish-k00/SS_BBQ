import axios from "axios";
import { toast } from "react-toastify";
import handle401Error from "../../middleware/logoutExp";

// const backEndUrl = "https://ss-bbq.onrender.com" || "http://localhost:8000";
const backEndUrl = "http://localhost:8000";

export const preparedProduct = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/display-box`);
    return data.orders;
  } catch (error) {
    await handle401Error(error);
    // console.log(error.response?.data);
  }
};

export const deliveryConform = async (orderId, latitude, longitude) => {
  try {
    const response = await axios.post(`${backEndUrl}/auth/conform-Delivery`, {
      orderId: orderId,
      geolocation: [latitude, longitude],
    });
    return response;
  } catch (error) {
    toast.error(error.response.data.message);
    await handle401Error(error);
  }
};

export const onDeliveryConform = async () => {
  try {
    const response = await axios.get(`${backEndUrl}/auth/on-delivery`);
    return response.data.orders;
  } catch (error) {
    await handle401Error(error);
    console.log(error);
    toast.error(error.response.data.message);
  }
};

export const onDeliveryConformOTP = async (contact) => {
  try {
    const response = await axios.post(`${backEndUrl}/auth/delivery-otp`, {
      contact: contact,
    });
    toast.success(response.data.message);
    return response;
  } catch (error) {
    await handle401Error(error);
    // console.log(error.response?.data.message);
    toast.error(error.response.data.message);
  }
};

export const editProfile = async (updatedData) => {
  try {
    const { data } = await axios.post(
      `${backEndUrl}/auth/editDeliveryProfile`,
      updatedData
    );
    toast.success(data?.message);
    return data.userData;
  } catch (error) {
    await handle401Error(error);
    // console.log(error, "ss");
  }
};

export const deliverdOrder = async () => {
  try {
    const { data } = await axios.get(`${backEndUrl}/auth/deliverd`);
    return data.orders;
  } catch (error) {
    await handle401Error(error);
    // console.log(error);
  }
};
