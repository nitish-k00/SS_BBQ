import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Card,
  Spinner,
  Button,
  Modal,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { onDeliveryConform } from "../middleware/API";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Otp from "../middleware/OTP";
import { BsGeoAlt } from "react-icons/bs";

function DOnDelivery() {
  const [deliveryData, setDeliveryData] = useState(null);
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [deliveryDataLoading, setDeliveryDataLoading] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(true);
  const [locationError, setLocationError] = useState("");

  const backEndUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  const navigate = useNavigate();
  const timerRef = useRef(null);
  const prvLocation = useRef(
    JSON.parse(localStorage.getItem("prvLocation")) || [0, 0]
  );

  const deliveryId = deliveryData?.orderIdDeliveryId;
  const orderId = deliveryData?.orderIdDeliveryId.split("-")[0];
  // //console.log(orderId);

  useEffect(() => {
    const fetchData = async () => {
      setDeliveryDataLoading(true);
      try {
        const response = await onDeliveryConform();
        // //console.log(response);
        setDeliveryData(response);
      } catch (error) {
        // //console.log(error);
      }
      setDeliveryDataLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      const updateLocation = async (position) => {
        const { latitude, longitude } = position.coords;
        if (
          latitude !== prvLocation.current[0] ||
          longitude !== prvLocation.current[1]
        ) {
          prvLocation.current = [latitude, longitude];
          localStorage.setItem(
            "prvLocation",
            JSON.stringify(prvLocation.current)
          );
          if (orderId) {
            try {
              await axios.put(`${backEndUrl}/auth/delivery-man-location`, {
                orderId: orderId,
                geolocation: [latitude, longitude],
              });
              //console.log(`Location updated: ${latitude}, ${longitude}`);
            } catch (error) {
              console.error("Error updating location:", error);
            }
          }
        } else {
          //console.log("Location has not changed.");
        }
      };

      const handleError = (error) => {
        handleLocationError(error);
      };

      navigator.geolocation.getCurrentPosition(updateLocation, handleError);

      timerRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition(updateLocation, handleError);
      }, 10000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [deliveryData]);

  const handleLocationError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError(
          "Please allow location access from your settings to get your exact location"
        );
        setIsLocationEnabled(false);
        break;
      case error.POSITION_UNAVAILABLE:
        console.error("Location information is unavailable.");
        setLocationError("Location information is unavailable.");
        setIsLocationEnabled(false);
        break;
      case error.TIMEOUT:
        console.error("The request to get user location timed out.");
        setLocationError(
          "The request to get user location timed out, please refresh the page and try again."
        );
        setIsLocationEnabled(false);
        break;
      case error.UNKNOWN_ERROR:
        console.error(
          "An unknown error occurred, please refresh the page and try again."
        );
        setLocationError("An unknown error occurred.");
        setIsLocationEnabled(false);
        break;
      default:
        console.error(
          "An error occurred: please refresh the page and try again",
          error
        );
        setLocationError("An error occurred.");
        setIsLocationEnabled(false);
    }
  };

  const handleMapIconClick = () => {
    const { geolocation } = deliveryData;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${geolocation[0]},${geolocation[1]}`;
    window.open(url, "_blank");
  };

  const handleEnterOtp = () => {
    setIsGeneratingOtp(true);
  };

  if (deliveryDataLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!deliveryData) {
    return (
      <Container className="d-flex justify-content-center align-items-center mt-5">
        <div className="text-center">
          <h2>NO CONFIRMED ORDERS TO DELIVER</h2>
          <Button
            onClick={() => navigate("/")}
            className="mt-4"
            variant="primary"
          >
            CONFIRM ORDER
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="p-3">
      {isLocationEnabled ? (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center bg-warning">
            <h4 className="mb-0">Delivery Details</h4>
            <Button variant="dark" onClick={handleMapIconClick}>
              <BsGeoAlt size={20} />
            </Button>
          </Card.Header>
          <Card.Body>
            <h6>
              <strong>Order ID:</strong> {deliveryData.orderIdDeliveryId}
            </h6>
            <h6>
              <strong>Customer Name:</strong> {deliveryData.customerName}
            </h6>
            <h6>
              <strong>Customer Address:</strong> {deliveryData.address}
            </h6>
            <h6>
              <strong>Customer Contact:</strong> {deliveryData.contact}
            </h6>
            <h6>
              <strong>Total:</strong> Rs.{deliveryData.total}
            </h6>
            <h6 className="text-primary mt-3">
              <strong>Products</strong>
            </h6>
            <Row className="mt-2">
              {deliveryData?.products?.map((product, index) => (
                <Col xs={12} sm={6} md={4} key={index}>
                  <Card className="bg-light mb-3">
                    <Card.Body>
                      <h6>
                        <strong>Product Name:</strong> {product.name}
                      </h6>
                      <h6>
                        <strong>Quantity:</strong> {product.quantity}
                      </h6>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="mt-3">
              <Button
                variant="primary"
                onClick={() => handleEnterOtp(deliveryData.contact)}
              >
                Enter OTP
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Modal
          show={!isLocationEnabled}
          onHide={() => setIsLocationEnabled(true)}
          style={{ marginTop: "200px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Turn on Location Services</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{locationError}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Refresh
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        show={isGeneratingOtp}
        onHide={() => setIsGeneratingOtp(false)}
        style={{ marginTop: "100px" }}
      >
        <Modal.Body>
          <Otp
            contact={deliveryData.contact}
            orderId={orderId}
            deliveryId={deliveryId}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default DOnDelivery;
