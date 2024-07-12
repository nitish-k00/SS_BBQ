import { Button, Container, Spinner, Form } from "react-bootstrap";
import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import CouponForm from "../middleware/CouponForm";
import CouponTable from "../middleware/CouponTable";
import { allCoupon } from "../middleware/API";

function ACoupon() {
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [formData, setFormData] = useState({
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
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchName, setSearchName] = useState("");

  const getAllCoupon = async () => {
    setLoading(true);
    try {
      const response = await allCoupon();
      setCoupons(response);
      setSearchName(response);
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const couponsFilter = (value) => {
    const filteredCoupons = coupons.filter((data) =>
      data.code.toLowerCase().includes(value.toLowerCase())
    );

    setSearchName(filteredCoupons);
  };

  useEffect(() => {
    getAllCoupon();
  }, []);

  return (
    <Container className="my-3">
      {loading ? (
        <div style={{ textAlign: "center", marginTop: "200px" }}>
          <h2>
            LOADING <Spinner animation="border" role="status" />
          </h2>
        </div>
      ) : (
        <>
          <Button
            variant="primary"
            className="mb-4"
            onClick={() => setIsModelOpen(true)}
          >
            Create Coupon
          </Button>

          <Form.Group controlId="searchName" className="mb-4">
            <Form.Control
              type="text"
              placeholder="Search by Code"
              onChange={(e) => couponsFilter(e.target.value)}
            />
          </Form.Group>

          <CouponTable setCoupons={setCoupons} coupons={searchName} />

          <Modal
            title="Create Coupon"
            open={isModelOpen}
            onCancel={() => setIsModelOpen(false)}
            footer={null}
          >
            <CouponForm
              formData={formData}
              setFormData={setFormData}
              setIsModelOpen={setIsModelOpen}
              setCoupons={setCoupons}
            />
          </Modal>
        </>
      )}
    </Container>
  );
}

export default ACoupon;
