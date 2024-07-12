import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { deliveryConform, preparedProduct } from "../middleware/API";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";

function DOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmOrders, setConfirmOrders] = useState(false);
  const [loadingConfirmOrders, setLoadingConfirmOrders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { accepted, blocked } = useSelector(selectUserInfo);

  const handlePreparedProduct = async () => {
    setLoading(true);
    try {
      const response = await preparedProduct();
      setOrders(response);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    handlePreparedProduct();
  }, []);

  const onClickDeliver = (order) => {
    setSelectedOrder(order);
    setConfirmOrders(true);
  };

  const onClickConfirmOrders = async () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser");
      return;
    }
    if (!selectedOrder) {
      setErrorMessage("Select the order");
      return;
    }

    setLoadingConfirmOrders(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await deliveryConform(
            selectedOrder.orderId,
            latitude,
            longitude
          );
          if (response.status === 200) {
            setSelectedOrder(null);
            navigate("/delivery");
          } else {
            setErrorMessage("Failed to confirm order. Please try again.");
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingConfirmOrders(false);
          setConfirmOrders(false);
        }
      },
      () => {
        setErrorMessage(
          "Unable to retrieve your location. Please turn on location services."
        );
        setLoadingConfirmOrders(false);
      }
    );
  };

  if (!accepted || blocked) {
    return (
      <div
        style={{
          width: "100%",
          height: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "200px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            maxWidth: "70%",
            maxHeight: "40vh",
            backgroundColor: blocked ? "red" : "orangered",
            padding: "40px 80px",
            fontWeight: "bolder",
            fontSize: "20px",
            borderRadius: "50% 20% / 10% 40%",
            color: "white",
          }}
        >
          {blocked ? (
            <>
              <p>You were blocked</p>
            </>
          ) : (
            <>
              <p>You're under verification</p>
              <p>Please wait for 2 to 3 days</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "200px",
        }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="p-3">
      {orders.length > 0 ? (
        orders.map((data) => (
          <Card
            key={data.orderId}
            className="mb-3 mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <Card.Body>
              <Card.Title>Order ID: {data.orderId}</Card.Title>
              <Card.Text>Address: {data.address}</Card.Text>
              <Button variant="primary" onClick={() => onClickDeliver(data)}>
                Ready to Deliver
              </Button>
            </Card.Body>
          </Card>
        ))
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "200px",
          }}
        >
          <h2>NO ORDERS READY FOR DELIVERY</h2>
        </div>
      )}
      <Modal
        show={confirmOrders}
        onHide={() => setConfirmOrders(false)}
        style={{ marginTop: "150px" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Warning</h4>
          {selectedOrder && (
            <>
              <p>-- {selectedOrder.orderId} --</p>
              <p>
                If you confirm the order, you need to deliver it within the
                specified time.
              </p>
              <p>Are you sure about that?</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={onClickConfirmOrders}
            disabled={loadingConfirmOrders}
          >
            {loadingConfirmOrders ? "Loading..." : "YES"}
          </Button>
          <Button
            variant="danger"
            onClick={() => setConfirmOrders(false)}
            disabled={loadingConfirmOrders}
          >
            CANCEL
          </Button>
        </Modal.Footer>
      </Modal>
      {errorMessage && (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
          {errorMessage}
        </Alert>
      )}
    </div>
  );
}

export default DOrders;
