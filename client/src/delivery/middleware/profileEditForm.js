import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";

const EditProfile = ({
  editData,
  onclickEditProfile,
  setEditData,
  loading,
}) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setErrors({});
  }, [editData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditData({ ...editData, [name]: value });
  };

  const EditProfileValidation = (formData, setErrors) => {
    const { phoneNo } = formData;
    const errors = {};
    if (!(phoneNo ?? "").trim()) errors.phoneNo = "Enter phone number";
    else if (!/^[0-9]{10}$/.test(phoneNo))
      errors.phoneNo = "Enter a valid 10-digit phone number";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!EditProfileValidation(editData, setErrors)) return;
    onclickEditProfile();
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "inherit",
      }}
      className="loginbg"
    >
      <Container className="my-5">
        <Row className="justify-content-center">
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
              <Form.Group controlId="formPhoneNo">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNo"
                  value={editData.phoneNo}
                  onChange={handleChange}
                  isInvalid={!!errors.phoneNo}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNo}
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-100 mt-3"
              >
                {loading ? (
                  <Spinner as="span" animation="border" size="sm" />
                ) : (
                  "Update"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditProfile;
