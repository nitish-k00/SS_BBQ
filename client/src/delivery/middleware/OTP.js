import axios from "axios";
import React, { useState, useEffect } from "react";
import { InputGroup, FormControl, Alert } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { onDeliveryConformOTP } from "./API";
import { BsCheckAll } from "react-icons/bs";

function Otp({ contact, orderId, deliveryId }) {
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loadingGenateOtp, setLoadingGenateOtp] = useState(false);
  const navigate = useNavigate();


  const backEndUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const handleOtpChange = (index, value) => {
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    if (index < 5 && value) {
      document.getElementById((index + 1).toString()).focus();
    }
  };

  const handleKeyDown = (index, event) => {
    const key = event.key;
    const nextInput = document.getElementById((index + 1).toString());
    const prevInput = document.getElementById((index - 1).toString());

    if (key === "ArrowRight" && nextInput) {
      nextInput.focus();
    }

    if (key === "ArrowLeft" && prevInput) {
      prevInput.focus();
    }

    if (key === "Backspace") {
      if (!otpValues[index] && prevInput) {
        prevInput.focus();
      } else {
        handleOtpChange(index, "");
      }
    }
  };

  const handleOTPSubmit = async () => {
    setLoading(true);
    const otp = otpValues.join("");

    if (!otp || otp.toString().length !== 6) {
      setMessage("The OTP should be 6 digits");
      setLoading(false);
      return;
    }
    console.log(contact, otp, orderId, deliveryId);
    try {
      setMessage("");
      const response = await axios.post(
        `${backEndUrl}/auth/delivery-otp-check`,
        {
          contact,
          otp,
          orderId,
          deliveryId,
        }
      );
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        navigate("/");
      }, 2000);
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
      console.error("Error verifying OTP or registering user:", error);
      console.log(error);
    }
    setLoading(false);
  };

  const generateOtp = async (e) => {
    e.preventDefault();
    setLoadingGenateOtp(true);
    try {
      const result = await onDeliveryConformOTP(contact);
      setMessage("New OTP generated");
      setOtpValues(new Array(6).fill(""));
    } catch (error) {
      setMessage(error.response.data.message || "Failed to generate OTP");
      console.error("Error sending OTP:", error);
    }
    setLoadingGenateOtp(false);
  };

  if (confirmed) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "green",
          height: "100vh",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <BsCheckAll style={{ marginRight: "8px", fontSize: "80px" }} />
        <h2>Successfull!</h2>
      </div>
    );
  }

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <div className="text-center bg-light p-5">
        <h3 className="mb-4"> OTP HAS SENT TO THE SMS {}</h3>
        <div className="d-flex justify-content-center">
          {otpValues.map((value, index) => (
            <InputGroup
              key={index}
              style={{ width: "50px", marginRight: "10px" }}
            >
              <FormControl
                key={index}
                id={index.toString()}
                type="text"
                maxLength={1}
                value={value}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                style={{ textAlign: "center" }}
              />
            </InputGroup>
          ))}
        </div>
        <button
          className="btn btn-primary mt-4"
          disabled={loading || loadingGenateOtp}
          onClick={handleOTPSubmit}
        >
          Submit
          {loading && (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              className="ms-2"
            />
          )}
        </button>
        <button
          className="btn btn-primary mt-4 ms-4"
          onClick={generateOtp}
          disabled={loadingGenateOtp || loading}
        >
          Regenerate OTP
          {loadingGenateOtp && (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              className="ms-2"
            />
          )}
        </button>
        {message && (
          <Alert
            className="mt-5"
            variant={
              message.includes("New OTP generated") ? "success" : "danger"
            }
          >
            <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
              {message.toLocaleUpperCase()}
            </p>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Otp;
