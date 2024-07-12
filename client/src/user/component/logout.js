import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { modifyUserInfo } from "../../redux/slices/userInfo";
import { logout } from "../middleware/API";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onclickLogout = async () => {
    setLoading(true);
    try {
      await logout();
      dispatch(modifyUserInfo(null));
      navigate("/login");
    } catch (error) {
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
