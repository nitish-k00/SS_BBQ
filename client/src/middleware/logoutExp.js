// errorHandler.js
import { store } from "../redux/store/store";
import { modifyUserInfo } from "../redux/slices/userInfo";
import axios from "axios";
import ReactDOM from "react-dom";
import SessionExpiredModal from "./SessionExpiredModal";

const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

const handle401Error = async (error) => {
  console.log(error.response?.status);
  if (error.response?.status === 401) {
    try {
      await axios.post(`${BASE_URL}/auth/logout`);
      store.dispatch(modifyUserInfo(null));
      localStorage.removeItem("token");
      const modalContainer = document.createElement("div");
      document.body.appendChild(modalContainer);
      ReactDOM.render(<SessionExpiredModal />, modalContainer);

      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(modalContainer);
        document.body.removeChild(modalContainer);
        window.location.href = "/login";
      }, 2000); // 2 seconds delay
    } catch (logoutError) {
      console.log(logoutError.response?.data?.message);
      console.log(logoutError);
    }
  } else {
    throw error;
  }
};

export default handle401Error;
