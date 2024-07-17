import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Card,
  CardBody,
  CardHeader,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../Delivery/LogRegDelivery.css";
import Otp from "../middleware/otp";

const LogRegDelivery = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [loginData, setLoginData] = useState({
    phone: "",
    password: "",
  });
  const [signupData, setSignupData] = useState({
    name: "",
    phone: "",
    email: "",
    newpassword: "",
    reenterpassword: "",
    driveingLisense: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //console.log(signupData, loginData);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    setFormError({});
  }, [loginData, signupData]);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  const handleLoginChange = (e) => {
    const { id, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "driveingLisense") {
      const image = files[0];
      if (!image) {
        return;
      }
      if (image?.size > 1048576) {
        // 1MB in bytes
        setFormError((prevError) => ({
          ...prevError,
          driveingLisense: "File size must be less than 1MB",
        }));
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onload = () => {
        setSignupData((prevData) => ({ ...prevData, [name]: reader.result }));
      };
    } else {
      setSignupData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const loginValidation = (data) => {
    const errors = {};
    if (!data.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const regValidate = (data) => {
    const errors = {};
    if (!data.name) {
      errors.name = "Name is required";
    }
    if (!data.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number is invalid";
    }
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email address is invalid";
    }
    if (!data.newpassword) {
      errors.newpassword = "Password is required";
    } else if (data.newpassword.length < 6) {
      errors.newpassword = "Password must be at least 6 characters";
    }
    if (data.newpassword !== data.reenterpassword) {
      errors.reenterpassword = "Passwords do not match";
    }
    if (!data.driveingLisense) {
      errors.driveingLisense = "Driving License is required";
    }
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!loginValidation(loginData)) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/delivery-login`,
        loginData
      );
      if (response.status === 200) {
        navigate(`/?token=${response.data.token}`);
      }

      setError("");
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message);
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!regValidate(signupData)) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/auth/generateOTPDeliveryRegister`,
        { phone: signupData.phone }
      );
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      console.error("Error sending OTP:", error);
    }
    setLoading(false);
  };

  return (
    <Container className="body my-5">
      {!otpSent ? (
        <div className="containerDelivery mb-5">
          <input type="checkbox" id="flip" />
          <div className="cover">
            <div className="front">
              <div className="text">
                <div className="image">
                  <img src="/img/logo.png" alt="Logo" />
                </div>
                <span className="text-1">No One Should Have A Bad Meal</span>
                <span className="text-2">Let's get started</span>
                <span className="text-3">SS BBQ</span>
              </div>
            </div>
            <div className="back">
              <div className="image">
                <img src="/img/logo.png" alt="Logo" />
              </div>
              <div className="text">
                <span className="text-1">No One Should Have A Bad Meal</span>
                <span className="text-2">Let's get started</span>
              </div>
            </div>
          </div>
          <div className="forms">
            <div className="form-content">
              <Card className={`login-form ${isSignup ? "hidden" : ""}`}>
                <CardHeader className="title">Login</CardHeader>
                <CardBody>
                  <Form onSubmit={handleLoginSubmit}>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="phone">Phone Number</FormLabel>
                      <FormControl
                        type="text"
                        id="phone"
                        placeholder="Enter your phone number"
                        value={loginData.phone}
                        onChange={handleLoginChange}
                        required
                        isInvalid={!!formError.phone}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.phone}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        required
                        isInvalid={!!formError.password}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.password}
                      </FormControl.Feedback>
                    </FormGroup>
                    <div className="text">
                      <a
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={() =>
                          navigate("/forgotPassword", {
                            state: {
                              forgotPassword: true,
                              delivery: "delivery",
                            },
                          })
                        }
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Button
                      variant="primary"
                      className="button"
                      block
                      type="submit"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <div className="text sign-up-text">
                      Don't have an account?{" "}
                      <label htmlFor="flip" onClick={toggleForm}>
                        Signup now
                      </label>
                    </div>
                    {error && <Alert variant="danger">{error}</Alert>}
                  </Form>
                </CardBody>
              </Card>
              <Card className={`signup-form ${!isSignup ? "hidden" : ""}`}>
                <CardHeader className="title">Signup</CardHeader>
                <CardBody>
                  <Form onSubmit={handleSignupSubmit}>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="signupName">Name</FormLabel>
                      <FormControl
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={signupData.name}
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.name}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.name}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="signupPhone">Phone Number</FormLabel>
                      <FormControl
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.phone}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.phone}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="signupEmail">Email</FormLabel>
                      <FormControl
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.email}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.email}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="signupDrivingLicense">
                        Driving License
                      </FormLabel>
                      <FormControl
                        type="file"
                        accept="image/*"
                        name="driveingLisense"
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.driveingLisense}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.driveingLisense}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup className="mb-3">
                      <FormLabel htmlFor="newpassword">New Password</FormLabel>
                      <FormControl
                        type="password"
                        name="newpassword"
                        placeholder="Enter your password"
                        value={signupData.newpassword}
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.newpassword}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.newpassword}
                      </FormControl.Feedback>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel htmlFor="reenterpassword">
                        Re-enter Password
                      </FormLabel>
                      <FormControl
                        type="password"
                        name="reenterpassword"
                        placeholder="Confirm your password"
                        value={signupData.reenterpassword}
                        onChange={handleSignupChange}
                        required
                        isInvalid={!!formError.reenterpassword}
                      />
                      <FormControl.Feedback type="invalid">
                        {formError.reenterpassword}
                      </FormControl.Feedback>
                    </FormGroup>
                    <Button
                      variant="primary"
                      className="button"
                      block
                      type="submit"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <div className="text sign-up-text">
                      Already have an account?{" "}
                      <label htmlFor="flip" onClick={toggleForm}>
                        Login now
                      </label>
                    </div>
                    {message && <Alert variant="danger">{message}</Alert>}
                  </Form>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <>
          <Otp formData={signupData} delivery={"delivery"} />
        </>
      )}
    </Container>
  );
};

export default LogRegDelivery;
