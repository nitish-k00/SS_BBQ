import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../index.css";
import { loginValidation } from "../middleware/formValidation";

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gloading, setGLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const onChangeUserData = (event) => {
    setUserData({ ...userData, [event.target.name]: event.target.value });
    setError("");
  };

  useEffect(() => {
    setFormError({});
  }, [userData]);

  const onSubmitForm = async () => {
    setLoading(true);
    try {
      if (!loginValidation(userData, setFormError)) {
        setLoading(false);
        return;
      }
      const response = await axios.post(`${BASE_URL}/auth/login`, userData);
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
      setError("");
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data?.message);
      } else {
        setError(error.response?.data?.message);
      }
    }
    setLoading(false);
  };

  const onclickGoogleAuth = () => {
    setGLoading(true);
    try {
      window.location.href = `${BASE_URL}/auth/google`;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "inherit",
      }}
      className="loingbg"
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: "40px 20px",
          borderRadius: "8px",
          backgroundColor: "#ffffff",
          margin: "30px 0px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div className="mb-3">
          <Button
            className="my-2 bg-dark"
            style={{ width: "100%", border: "none" }}
            onClick={() => navigate("/LogRegDelivery")}
          >
            Delivery
          </Button>
          <h1 className="p-3 radius-1 main bg1">WELCOME BACK</h1>
        </div>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={userData.email}
              onChange={onChangeUserData}
              isInvalid={!!formError.email}
            />
            <Form.Control.Feedback type="invalid">
              {formError.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={onChangeUserData}
              isInvalid={!!formError.password}
            />
            <Form.Control.Feedback type="invalid">
              {formError.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            onClick={onSubmitForm}
            disabled={loading}
            className="mb-2"
            style={{ width: "100%" }}
          >
            {loading ? (
              <Spinner animation="border" size="sm" role="status" />
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        <p className="text-center my-3">------- or -------</p>

        <Button
          variant="dark"
          onClick={onclickGoogleAuth}
          disabled={gloading}
          style={{ width: "100%" }}
        >
          {gloading ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            <>
              <img src="img/icons8-google-48.png" alt="Google Icon" />
              <span className="ms-2">Login with Google</span>
            </>
          )}
        </Button>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}

        <div className="text-center mt-3">
          <Button
            variant="link"
            onClick={() =>
              navigate("/forgotPassword", { state: { forgotPassword: true } })
            }
          >
            Forgot Password?
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
