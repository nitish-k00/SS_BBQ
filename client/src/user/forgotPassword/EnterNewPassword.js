import axios from "axios";
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

function EnterNewPassword() {
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSucces] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const delivery = location.state;
  console.log(delivery);

  const BASE_URL =  process.env.REACT_APP_BACKEND_URL ||"http://localhost:8000";

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (password !== reenteredPassword) {
      setError("Passwords do not match");
    } else if (password.length < 6) {
      setError("Password must be at least 6 characters long");
    } else {
      setLoading(true);
      try {
        let response;
        if (delivery) {
          response = await axios.post(
           `${BASE_URL}/auth/NewPaawordDelivery`,
            {
              password: reenteredPassword,
            }
          );
        } else {
          response = await axios.post(`${BASE_URL}/auth/NewPaaword`, {
            password: reenteredPassword,
          });
        }

        if (response.status === 200) {
          setMessage(response?.data?.message);
          setSucces(true);
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
        console.log("e");
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    setError("");
  }, [password]);

  return (
    <Container style={{ marginTop: "100px" }}>
      {!success ? (
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
                <Form.Group controlId="formNewPassword">
                  <Form.Label>Enter New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!error && password !== reenteredPassword}
                  />
                </Form.Group>
                <Form.Group controlId="formReenterPassword" className="mt-3">
                  <Form.Label>Re-Enter Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter password"
                    value={reenteredPassword}
                    onChange={(e) => setReenteredPassword(e.target.value)}
                    isInvalid={!!error && password !== reenteredPassword}
                  />
                  {error && (
                    <Form.Control.Feedback type="invalid">
                      {error}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className="mt-3"
                  block
                >
                  Submit {loading && <Spinner size="sm" />}
                </Button>
                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      ) : (
        <div>
          <p
            style={{
              color: "green",
              textAlign: "center",
              fontSize: "40px",
              fontWeight: "bolder",
            }}
          >
            {message} <Spinner></Spinner>
          </p>
        </div>
      )}
    </Container>
  );
}

export default EnterNewPassword;
