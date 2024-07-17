import React, { useEffect, useState } from "react";
import { deliveryStatusChange, singleOrders } from "./API";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Container, Row, Col, Table, Spinner } from "react-bootstrap";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [productId, setProductId] = useState("");
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // //console.log(order, "ss");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await singleOrders(id);
      setOrder(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const onchangeStatus = async (status, productId) => {
    setStatusChangeLoading(true);
    setProductId(productId);
    try {
      const response = await deliveryStatusChange(
        order.orderId,
        status,
        productId
      );
      setOrder(response.orders);
      setProductId("");
    } catch (error) {
      // //console.log(error);
    }
    setStatusChangeLoading(false);
    setProductId("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "#808080"; // Gray
      case "confirmed":
        return "#0000FF"; // Blue
      case "prepared":
        return "#FFA500"; // Orange
      case "picked":
        return "#800080"; // Purple
      case "delivered":
        return "#008000"; // Green
      default:
        return "#FFFFFF"; // White for unknown statuses
    }
  };

  if (!order) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Button
        variant="primary"
        onClick={() =>
          navigate(`${location.state.page}`, {
            state: { backpage: location.state.currentPage },
          })
        }
        className="mb-3"
      >
        Go Back
      </Button>
      <h2 className="bold">Order Details</h2>
      <hr />
      <Row>
        <Col md={6}>
          <h4 className="bold">Customer Details</h4>
          <p>
            <strong>Name:</strong> {order.customer.name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer.email || "N/A"}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer.contact}
          </p>
          <p>
            <strong>Address:</strong> {order.customer.address}
          </p>
        </Col>

        <Col md={6}>
          <h4 className="bold">Order Information</h4>
          <p>
            <strong>Order ID:</strong> {order.orderId}
          </p>
          <p>
            <strong>Order Date:</strong> {new Date(order.date).toLocaleString()}
          </p>
          <p>
            <strong>Coupon Applied:</strong>{" "}
            {order.appliedCoupon ? order.appliedCoupon.code : "No"}
          </p>
          <p>
            <strong>Coupon Discount:</strong> ₹
            {order.appliedCouponDiscount || 0}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{order.total}
          </p>
        </Col>
      </Row>

      <h4 className="mt-4">Products</h4>
      <Table striped bordered hover responsive className="mt-2">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Delivered Time</th>
            <th>Discount</th>
            <th>Discount Price</th>
            <th>Sub Total</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product) => (
            <tr key={product.product._id}>
              <td>
                <img
                  src={product.product.photo[0]}
                  alt={product.product.name}
                  width="50"
                />
              </td>
              <td>{product.product.name}</td>
              <td>₹{product.product.price}</td>
              <td>{product.quantity}</td>
              <td>
                {productId === product.product._id && statusChangeLoading ? (
                  <Spinner animation="border" role="status" />
                ) : order.payment.status !== "completed" ||
                  product.orderStatus === "picked" ||
                  product.orderStatus === "delivered" ? (
                  <span
                    style={{
                      backgroundColor: getStatusColor(product.orderStatus),
                      color: "white",
                      padding: "3px 5px",
                    }}
                  >
                    {product.orderStatus}
                  </span>
                ) : (
                  <select
                    style={{
                      backgroundColor: getStatusColor(product.orderStatus),
                      color: "white",
                      padding: "3px 5px",
                    }}
                    value={product.orderStatus}
                    onChange={(e) =>
                      onchangeStatus(e.target.value, product.product._id)
                    }
                  >
                    <option value="created">created</option>
                    <option value="confirmed">confirmed</option>
                    <option value="prepared">prepared</option>
                  </select>
                )}
              </td>
              <td>
                {product.deliveredTime
                  ? new Date(product.deliveredTime).toLocaleString()
                  : "Pending"}
              </td>
              <td>{product.product.discount} %</td>
              <td>
                - ₹
                {product.product.price * product.quantity -
                  product.product.discountPrice * product.quantity}
              </td>
              <td>₹{product.product.price * product.quantity}</td>
              <td>{product.product.discountPrice * product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default OrderDetail;
