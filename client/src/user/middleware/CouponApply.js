import React, { useEffect, useState } from "react";
import { Button, Spinner, Dropdown } from "react-bootstrap";
import { applyCoupon, getAllCoupon, removeCoupon } from "./API";

function CouponApply({ setCartValue, cartValue }) {
  const [allCoupons, setAllCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState({});
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await getAllCoupon();
        setAllCoupons(response.coupons);
      } catch (error) {
        console.error("Failed to fetch coupons:", error);
        setError("Failed to fetch coupons. Please try again later.");
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    if (cartValue && cartValue.appliedCoupon) {
      const coupon = allCoupons.find(
        (data) => data._id === cartValue.appliedCoupon
      );
      if (coupon) {
        setAppliedCoupon(coupon);
      } else {
        setAppliedCoupon({});
      }
    } else {
      setAppliedCoupon({});
    }
  }, [cartValue, allCoupons]);

  const handleApplyCoupon = async () => {
    if (!selectedCoupon) {
      setError("Please select a coupon");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await applyCoupon(selectedCoupon);
      if (response.userCart) {
        setCartValue(response.userCart);
      }
      setAppliedCoupon(response.appliedCoupon);
    } catch (error) {
      console.error("Failed to apply coupon:", error);
      setError("Failed to apply coupon. Please try again.");
    }
    setLoading(false);
  };

  const handleRemoveCoupon = async () => {
    setRemoveLoading(true);
    setError("");
    try {
      const response = await removeCoupon(appliedCoupon.code);
      if (response.userCart) {
        setCartValue(response.userCart);
      }
      setAppliedCoupon({});
    } catch (error) {
      console.error("Failed to remove coupon:", error);
      setError("Failed to remove coupon. Please try again.");
    }
    setRemoveLoading(false);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {appliedCoupon && appliedCoupon.code ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: "300px",
            padding: "15px",
            border: "2px solid #f78000",
            borderRadius: "8px",
            backgroundColor: "#fff3e0",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            color: "#333",
          }}
        >
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, color: "#f78000", fontSize: "1.2rem" }}>
              Applied Coupon: {appliedCoupon.code}
            </h4>
            <p style={{ margin: "5px 0", fontSize: "0.9rem" }}>
              Discount: {appliedCoupon.discountValue}{" "}
              {appliedCoupon.discountType === "fixed" ? "Rs" : "%"}
            </p>
          </div>
          <Button
            variant="danger"
            onClick={handleRemoveCoupon}
            style={{
              padding: "8px 12px",
              backgroundColor: "#f44336",
              border: "none",
              borderRadius: "5px",
              color: "#fff",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "0.8rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            disabled={removeLoading}
          >
            {removeLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Remove Coupon"
            )}
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown style={{ marginRight: "10px" }}>
            <Dropdown.Toggle
              variant="outline-primary"
              id="dropdown-basic"
              style={{
                padding: "8px 12px",
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                border: "2px solid #f78000",
                borderRadius: "5px",
                color: "#f78000",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {selectedCoupon
                ? `Selected Coupon: ${selectedCoupon}`
                : "Select Coupon"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {allCoupons.length === 0 ? (
                <Dropdown.Item disabled>No coupons available</Dropdown.Item>
              ) : (
                allCoupons.map((coupon) => (
                  <Dropdown.Item
                    key={coupon._id}
                    onClick={() => setSelectedCoupon(coupon.code)}
                  >
                    ({coupon.code}) {coupon.description}
                  </Dropdown.Item>
                ))
              )}
            </Dropdown.Menu>
          </Dropdown>

          <Button
            variant="primary"
            onClick={handleApplyCoupon}
            disabled={loading}
            style={{
              height: "36px",
              padding: "8px 12px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Apply"}
          </Button>
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
}

export default CouponApply;
