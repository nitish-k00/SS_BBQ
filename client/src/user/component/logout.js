import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifyUserInfo } from "../../redux/slices/userInfo";
import { logout } from "../middleware/API";

function Logout({ onLogout }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onclickLogout = async () => {
    setLoading(true);
    try {
      console.log("called 1");
      await logout();
      console.log("called 2");
      dispatch(modifyUserInfo(null));
      localStorage.removeItem("token");
      console.log("called 3");
      navigate("/login");
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        dispatch(modifyUserInfo(null));
      }
      console.log(error.response?.data?.message);
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <div>
      <Button
        onClick={onclickLogout}
        className="bg-danger"
        style={{ border: "none", fontWeight: "bold" }}
      >
        {loading ? (
          <Spinner animation="border" size="sm" role="status" />
        ) : (
          "Logout"
        )}
      </Button>
    </div>
  );
}

export default Logout;
