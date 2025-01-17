import axios from "axios";
import React, { useState, useEffect } from "react";
import { InputGroup, FormControl, Alert } from "react-bootstrap";
import { Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

function EnterOtp() {
  const [otpValues, setOtpValues] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGenateOtp, setLoadingGenateOtp] = useState(false);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  //

  const location = useLocation();
  const EnterdEmail = location.state.email || null;
  const delivery = location.state.delivery;
  //console.log(delivery, "2");
  //

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

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 0) {
          clearInterval(interval);
          setOtpExpired(true);
          setMessage("");
          return 0;
        } else {
          return prevTimer - 1;
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOTPSubmit = async () => {
    setLoading(true);
    const otp = otpValues.join("");

    if (!otp || otp.toString().length !== 6) {
      setMessage("The OTP should be 6 digits");
      setLoading(false);
      return;
    }
    try {
      setMessage(""); // Clear previous message

      let response;

      if (delivery) {
        response = await axios.post(
          `${BASE_URL}/auth/forgotPasswordOtpCheackDelivery`,
          {
            otp: otp,
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/auth/forgotPasswordOtpCheack`,
          {
            otp: otp,
          }
        );
      }

      if (response.status == 200) {
        navigate("/newPassword", { state: { otp: true }, delivery: delivery });
      }
    } catch (error) {
      setMessage(error.response.data.message || "An error occurred");
      console.error("Error verifying OTP or registering user:", error);
    }
    setLoading(false);
  };

  const generateOtp = async (e) => {
    e.preventDefault();
    setLoadingGenateOtp(true);
    try {
      const result = await axios.post(
        `${BASE_URL}/auth/genrateotpForgotPassword`,
        {
          email: EnterdEmail,
        }
      );
      setMessage("New OTP generated");
      setTimer(60);
      setOtpValues(new Array(6).fill(""));
      setOtpExpired(false);
    } catch (error) {
      setMessage(error.response.data.message || "Failed to generate OTP");
      console.error("Error sending OTP:", error);
    }
    setLoadingGenateOtp(false);
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "70vh",overflowX:"hidden" }}
    >
      <div className="text-center bg-light p-5">
        <h3 className="mb-4"> OTP HAS SENT TO YOUR MAIL</h3>
        {otpExpired ? "" : <p>Time remaining: {formatTime(timer)}</p>}
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
                inputMode="numeric"
              />
            </InputGroup>
          ))}
        </div>
        <button
          className="btn btn-primary mt-4"
          disabled={otpExpired}
          onClick={handleOTPSubmit}
        >
          {loading ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            "Submit"
          )}
        </button>
        <button className="btn btn-primary mt-4 ms-4" onClick={generateOtp}>
          {loadingGenateOtp ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            "Regenerate OTP"
          )}
        </button>
        <p
          style={{
            color: message.includes("New OTP generated") ? "green" : "red",
            marginTop: "38px",
          }}
        >
          {otpExpired && !message ? (
            <Alert variant="danger">OTP has expired</Alert>
          ) : (
            message && (
              <Alert
                variant={
                  message.includes("New OTP generated") ? "success" : "danger"
                }
              >
                {message}
              </Alert>
            )
          )}
        </p>
      </div>
    </div>
  );
}

export default EnterOtp;
