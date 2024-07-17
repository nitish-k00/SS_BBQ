import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { createCoupon, editCoupon } from "./API";

const CouponForm = ({ formData, setFormData, setIsModelOpen, setCoupons }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleKeyDown = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = formData._id
        ? await editCoupon(formData)
        : await createCoupon(formData);

      // //console.log(response);
      setCoupons((prevCoupons) => {
        if (formData._id) {
          // Edit mode
          return prevCoupons.map((coupon) =>
            coupon._id === formData._id ? response : coupon
          );
        } else {
          // Create mode
          return [...prevCoupons, response];
        }
      });
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        expiryDate: "",
        maxUses: "",
        uses: 0,
        active: true,
        minOrderValue: "",
      });
      setIsModelOpen(false);
    } catch (error) {
      console.error("Failed to create coupon:", error);
    }
    setLoading(false);
  };

  return (
    <Container className="mt-3">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter coupon code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Discount Type</Form.Label>
          <Form.Select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Discount Value</Form.Label>
          <div className="input-group">
            <Form.Control
              type="number"
              placeholder="Enter discount value"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
            />
            <span className="input-group-text">
              {formData.discountType === "percentage" ? "%" : "₹"}
            </span>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            type="datetime-local"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Max Uses</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max uses"
            name="maxUses"
            value={formData.maxUses}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Min Order Value</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter min order value"
            name="minOrderValue"
            value={formData.minOrderValue}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Enter coupon description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
          className="w-100"
        >
          {formData._id ? "Edit Coupon" : "Create Coupon"}
          {loading && <Spinner animation="border" size="sm" className="ms-2" />}
        </Button>
      </Form>
    </Container>
  );
};

export default CouponForm;
