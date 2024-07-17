import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function EnterEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const delivery = location.state.delivery;
  //console.log(delivery);

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
  //

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      let response;
      if (delivery) {
        response = await axios.post(
          `${BASE_URL}/auth/GetForgotPasswordEmailDelivery`,
          { email: email }
        );
      } else {
        response = await axios.post(`${BASE_URL}/auth/GetForgotPasswordEmail`, {
          email: email,
        });
      }
      if (!response.status === 404 || 500) {
        navigate("/forgotPasswordOTP", {
          state: { forgotPasswordEmail: true, email: email, delivery },
        });
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response?.data?.message);
      }
      //console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setError("");
  }, [email]);

  return (
    <Container style={{ marginTop: "200px" }}>
      <Row className="justify-content-center">
        <Col md={6}>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Form>
              <Form.Group controlId="formEmail">
                <Form.Label>Enter Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={!!error}
                />
                <Form.Control.Feedback type="invalid">
                  {error}
                </Form.Control.Feedback>
              </Form.Group>
              <Button
                variant="primary"
                onClick={onSubmit}
                className="mt-3"
                disabled={loading}
                block
              >
                Submit {loading && <Spinner size="sm"></Spinner>}
              </Button>
            </Form>
          </div>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default EnterEmail;
