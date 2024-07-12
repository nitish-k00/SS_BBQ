import React, { useState, useEffect } from "react";
import Maps from "./Maps";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { EditProfileValidation } from "./formValidation";

const EditProfile = ({
  editData,
  onclickEditProfile,
  setEditData,
  loading,
}) => {
  const [errors, setErrors] = useState({});
  const [locationAcsess, setLocationAcsess] = useState();

  console.log(editData);

  navigator.geolocation.getCurrentPosition((position) =>
    setLocationAcsess(position.coords.latitude || "")
  );

  useEffect(() => {
    setErrors({});
  }, [editData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditData({ ...editData, [name]: value });
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
              <Form.Group controlId="formAddress">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

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

              <Form.Group controlId="formMap">
                <Form.Label>Delivery Address</Form.Label>
                <Maps editData={editData} setEditData={setEditData} />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                disabled={loading || !locationAcsess}
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
