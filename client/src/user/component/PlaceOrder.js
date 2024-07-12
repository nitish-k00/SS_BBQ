import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { modifyUserInfo, selectUserInfo } from "../../redux/slices/userInfo";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { Modal } from "antd";
import EditProfile from "../middleware/profileEditForm";
import { editProfile, getCartcheack } from "../middleware/API";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet-routing-machine";
import handlePayment from "../middleware/payment";

function PlaceOrder() {
  const userData = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   console.log(userData);

  const [editData, setEditData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [datacart, setDatacart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [travelTime, setTravelTime] = useState(null);
  const [checkOutLoading, setCheckOutLoading] = useState(false);
  //   console.log(editData);

  const onclickEditProfile = async () => {
    setLoading(true);
    try {
      const newUserData = await editProfile(editData);
      dispatch(modifyUserInfo(newUserData));
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onSucess = () => {
    navigate("/menu");
  };

  const goToPamentPage = async () => {
    if (
      userData.latitude &&
      userData.longitude &&
      userData.address &&
      userData.phoneNo
    ) {
      setMessage("");
      setCheckOutLoading(true);
      if (datacart.total) {
        await handlePayment(
          datacart.total,
          userData.name,
          userData.email,
          userData.phoneNo,
          onSucess
        );
      }
      setCheckOutLoading(false);
    } else {
      setMessage("Allow location by editing your profile.");
    }
  };

  const fetchCartcheack = async () => {
    setCartLoading(true);
    try {
      const cartData = await getCartcheack();
      setDatacart(cartData);
    } catch (error) {
      console.log(error);
    }
    setCartLoading(false);
  };

  const TimeTakenToTravel = () => {
    const targetLocation = { lat: 11.074786226196956, lng: 78.00728674295594 };
    if (userData.latitude && userData.longitude) {
      const hiddenMap = L.map(document.createElement("div")).setView(
        [userData.latitude, userData.longitude],
        13
      );
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userData.latitude, userData.longitude),
          L.latLng(targetLocation.lat, targetLocation.lng),
        ],
        createMarker: () => null, // Disable markers
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
      }).addTo(hiddenMap); // Add the control to the hidden map

      routingControl.on("routesfound", function (e) {
        const routes = e.routes;
        const summary = routes[0].summary;
        const distanceKm = summary.totalDistance / 1000; // Convert meters to kilometers
        // console.log(`Distance in Km: ${distanceKm}`); // Added for debugging

        const speedKmH = 30; // Fixed speed in km/h
        const travelTimeH = distanceKm / speedKmH; // Travel time in hours
        const travelTimeMin = travelTimeH * 60; // Convert hours to minutes
        // console.log(`Travel Time in Min: ${travelTimeMin}`); // Added for debugging

        setTravelTime((travelTimeMin + 3).toFixed(2)); // Add 3 minutes to the travel time and set it in minutes
      });

      routingControl.route();
    }
  };

  useEffect(() => {
    fetchCartcheack();
    setEditData({ address: userData.address, phoneNo: userData.phoneNo });

    if (userData.latitude && userData.longitude) {
      TimeTakenToTravel();
    }
  }, [userData]);

  // console.log(datacart);

  return (
    <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
      <Row>
        <Col md={6} style={{ marginBottom: "20px" }}>
          <h3
            className="text"
            style={{ fontSize: "30px", fontWeight: "bolder" }}
          >
            Delivery Address
          </h3>
          <div
            style={{
              marginTop: "10px",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p>
                <strong>Name:</strong> {userData.name}
              </p>
              <p>
                <strong>Email:</strong> {userData.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {userData.phoneNo}
              </p>
              <p style={{ maxWidth: "400px" }}>
                <strong>Address:</strong> {userData.address},<br />
                {userData.MapAddress}
              </p>
            </div>

            <div>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                style={{ marginRight: "10px", marginTop: "10px" }}
              >
                Edit Address
              </Button>
              {message && (
                <p className="mt-3" style={{ color: "red" }}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <h2
            className="text"
            style={{ fontSize: "30px", fontWeight: "bolder" }}
          >
            Products
          </h2>

          {cartLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <div
              style={{
                marginTop: "10px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontWeight: "bolder" }}>
                {travelTime !== null
                  ? `Preparing time (15 minutes) +  Travel time (${travelTime} minutes)`
                  : ""}
              </p>
              {datacart.products &&
                datacart.products.map((data) => (
                  <div
                    key={data._id._id}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #ddd",
                      backgroundColor: "#fff",
                      marginBottom: "10px",
                    }}
                  >
                    <p>
                      {data._id.name} x {data.quantity}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </Col>
        <Button
          variant="success"
          style={{
            maxWidth: "90%",
            margin: "50px auto",
            display: "block",
            fontSize: "20px",
            fontWeight: "bolder",
            backgroundColor: "#f78000",
            border: "none",
          }}
          disabled={checkOutLoading}
          onClick={goToPamentPage}
        >
          Check Out {checkOutLoading && <Spinner size="sm" />}
        </Button>
      </Row>

      <Modal
        title="Edit Profile"
        open={isModalOpen}
        footer={null}
        width="70vw"
        onCancel={() => setIsModalOpen(false)}
      >
        <EditProfile
          editData={editData}
          onclickEditProfile={onclickEditProfile}
          setEditData={setEditData}
          loading={loading}
        />
      </Modal>
    </Container>
  );
}

export default PlaceOrder;
