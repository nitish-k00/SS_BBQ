import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import CouponForm from "./CouponForm";
import { deleteCoupon } from "./API";
import { FaEdit, FaTrash } from "react-icons/fa";

const CouponTable = ({ setCoupons, coupons }) => {
  const [ismodelopen, setIsModelOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletes, setDeletes] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleEdit = (data) => {
    const date = new Date(data.expiryDate);
    const formattedDate = date.toISOString().split(".")[0];

    setFormData({ ...data, expiryDate: formattedDate });
    setIsModelOpen(true);
  };

  const handleDelete = async (couponId) => {
    setLoadingDelete(true);
    try {
      const response = await deleteCoupon(couponId);
      setCoupons(coupons.filter((data) => data._id !== response._id));
      setDeleteModalOpen(false);
    } catch (error) {
      // //console.log(error);
    }
    setLoadingDelete(false);
  };

  return (
    <Container>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Code</th>
            <th>Description</th>
            <th>Discount Type</th>
            <th>Discount Value</th>
            <th>Expiry Date</th>
            <th>Max Uses</th>
            <th>Uses</th>
            <th>Active</th>
            <th>Min Order Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons ? (
            coupons.map((coupon, index) => (
              <tr key={index}>
                <td>{coupon.code}</td>
                <td>{coupon?.description}</td>
                <td>{coupon.discountType}</td>
                <td>{coupon.discountValue}</td>
                <td>{new Date(coupon.expiryDate).toLocaleString()}</td>
                <td>{coupon.maxUses}</td>
                <td>{coupon.uses}</td>
                <td>{coupon.active ? "Yes" : "No"}</td>
                <td>{coupon.minOrderValue}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(coupon)}
                    className="mb-2"
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDeletes(coupon);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10}>NO COUPON FOUND</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={ismodelopen} onHide={() => setIsModelOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Coupon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CouponForm
            formData={formData}
            setFormData={setFormData}
            setIsModelOpen={setIsModelOpen}
            setCoupons={setCoupons}
          />
        </Modal.Body>
      </Modal>

      <Modal show={DeleteModalOpen} onHide={() => setDeleteModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "10px", color: "red" }}>Warning</h2>
            <h4 style={{ marginBottom: "10px" }}>-- {deletes.code} --</h4>
            <p>The Coupon will be permanently deleted.</p>
            <p>Are you sure about that?</p>
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="danger"
                onClick={() => handleDelete(deletes._id)}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "YES"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CouponTable;
