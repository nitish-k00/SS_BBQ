import React, { useEffect, useState } from "react";
import { userOrders } from "../middleware/API";
import { Container, Row, Col, Card, Spinner, Modal } from "react-bootstrap";
import { MdPlace } from "react-icons/md";
import MapComponent from "../middleware/MapComponent";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/slices/userInfo";
import io from "socket.io-client";

const BASE_URL = "http://localhost:8000";
const socket = io.connect(BASE_URL);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMap, setOpenMap] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const userData = useSelector(selectUserInfo);

  useEffect(() => {
    const userLocation = [
      Number(userData.latitude),
      Number(userData.longitude),
    ];
    setDestination(userLocation);
    fetchOrders();
  }, [userData.latitude, userData.longitude]);

  const fetchOrders = async () => {
    try {
      const response = await userOrders();
      setOrders(response.orders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMap = (location) => {
    setOrigin(location);
    setOpenMap(true);
  };

  const handleCloseMap = () => {
    setOpenMap(false);
  };

  useEffect(() => {
    socket.on("connection", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("deliveryManLocationUpdate", (msg) => {
      console.log("Received message:", msg);
      setOrigin(msg);
    });

    return () => {
      socket.off("connection");
      socket.off("disconnect");
      socket.off("deliveryManLocationUpdate");
    };
  }, []);

  return (
    <Container className="my-5">
      <h4 style={{ marginBottom: "20px" }}>My Orders</h4>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "80vh" }}
        >
          <Spinner animation="border" />
        </div>
      ) : orders?.length > 0 ? (
        orders?.map((order, index) => (
          <Card key={index} className="mb-4">
            <Card.Body>
              <Row>
                <Col>
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleString("en-US", {
                      hour12: true,
                    })}
                  </p>
                  {order?.deliveredTime && (
                    <p>
                      <strong>Delivered Date:</strong>{" "}
                      {new Date(order.deliveredTime).toLocaleString("en-US", {
                        hour12: true,
                      })}
                    </p>
                  )}
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          order.paymentStatus === "completed" ? "green" : "red",
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Coupon Discount:</strong> - Rs.{order.coupon || 0}
                  </p>
                  <p>
                    <strong>Total:</strong> Rs.{order.total}
                  </p>
                </Col>
                {order.orderStatus.status === "picked" && (
                  <Col className="text-right">
                    <div>
                      <p>
                        <strong>Live Location:</strong>{" "}
                        <MdPlace
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "orange",
                            padding: "5px",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleOpenMap(order.orderStatus.Geolocation)
                          }
                        />
                      </p>
                      <p>
                        <strong>Delivery Man:</strong>{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {order.orderStatus.name}
                        </span>
                      </p>
                      <p>
                        <strong>Contact:</strong>{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {order.orderStatus.contact}
                        </span>
                      </p>
                    </div>
                  </Col>
                )}
              </Row>
              <Row>
                {order.products.map((productItem, idx) => (
                  <Col xs={12} md={6} lg={4} key={idx}>
                    <Card className="mb-3" style={{width:"250px"}}>
                      <Card.Img
                        variant="top"
                        src={productItem.product.photo[0]}
                        alt={productItem.product.name}
                        className="img-fluid"
                        style={{
                          objectFit: "cover",
                          height: "150px",
                        }}
                      />
                      <Card.Body>
                        <Card.Title>{productItem.product.name}</Card.Title>
                        <Card.Text>
                          <strong>Price:</strong> Rs.
                          {productItem.product.discountPrice}
                        </Card.Text>
                        <Card.Text>
                          <strong>Quantity:</strong> {productItem.quantity}
                        </Card.Text>
                        <Card.Text>
                          <strong>Status:</strong>{" "}
                          <span
                            style={{
                              color:
                                productItem.orderStatus !== "created"
                                  ? "green"
                                  : "orange",
                            }}
                          >
                            {productItem.orderStatus}
                          </span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        ))
      ) : (
        <p>No orders found.</p>
      )}

      <Modal show={openMap} onHide={handleCloseMap} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Delivery Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {origin && destination && (
            <MapComponent origin={origin} destination={destination} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Orders;
