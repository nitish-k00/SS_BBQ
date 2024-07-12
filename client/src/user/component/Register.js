import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import Otp from "../middleware/otp";
import { regValidate } from "../middleware/formValidation";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    newpassword: "",
    reenterpassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    setErrors({});
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regValidate(formData, setErrors)) return;
    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/genrateotp`, {
        email: formData.email,
        content: "registration",
      });
      setOtpSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      console.error("Error sending OTP:", error);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
      }}
      className="loingbg"
    >
      <Container className="my-5">
        <Row className="justify-content-center">
          {!otpSent ? (
            <Col xs={12} md={6}>
              <Form
                style={{
                  padding: "30px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                }}
                onSubmit={handleRegister}
              >
                {[
                  { name: "name", label: "Name", type: "text" },
                  { name: "email", label: "Email", type: "email" },
                  {
                    name: "newpassword",
                    label: "New Password",
                    type: "password",
                  },
                  {
                    name: "reenterpassword",
                    label: "Re-enter Password",
                    type: "password",
                  },
                ].map((field) => (
                  <Form.Group
                    key={field.name}
                    controlId={field.name}
                    className="mb-3"
                  >
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      isInvalid={!!errors[field.name]}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors[field.name]}
                    </Form.Control.Feedback>
                  </Form.Group>
                ))}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="w-100"
                  style={{ marginTop: "20px" }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Register"
                  )}
                </Button>
                {message && (
                  <Alert variant="danger" className="mt-3">
                    {message}
                  </Alert>
                )}
              </Form>
            </Col>
          ) : (
            <Otp formData={formData} />
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Register;
