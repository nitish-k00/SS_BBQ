import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Navbar,
  Container,
  Offcanvas,
  Button,
  ListGroup,
  Image,
} from "react-bootstrap";
import { selectUserInfo } from "../../redux/slices/userInfo";
import Logout from "../../user/component/logout";
import {
  FaBars,
  FaUserCircle,
  FaTachometerAlt,
  FaTags,
  FaListAlt,
  FaCoffee,
  FaUsers,
  FaChartBar,
  FaShoppingCart,
  FaTruck,
  FaRegistered,
  FaSignOutAlt,
} from "react-icons/fa";

export default function ANavbar() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const userData = useSelector(selectUserInfo);

  const iconStyle = { marginRight: "10px", color: "#007bff" };
  const listItemStyle = { padding: "10px 20px", fontSize: "16px" };

  return (
    <div style={{ height: "10vh" }}>
      <Navbar bg="primary" expand="lg" fixed="top">
        <Container fluid>
          <Button
            variant="outline-primary"
            onClick={handleShow}
            style={{ color: "white" }}
          >
            <FaBars />
          </Button>
          <Navbar.Brand href="#" className="bold h1" style={{ color: "white" }}>
            SS BBQ
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} style={{ width: "260px" }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>SS BBQ</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup variant="flush">
            <div className="ms-4 mb-4">
              <Image
                src={userData.avatar}
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
                  border: "4px solid #007bff",
                }}
              />
            </div>
            <ListGroup.Item
              action
              as={Link}
              to="/profile"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaUserCircle style={iconStyle} /> Profile
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/dashboard"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaTachometerAlt style={iconStyle} /> Dashboard
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/category"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaListAlt style={iconStyle} /> Category
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/product"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaCoffee style={iconStyle} /> Product
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/coupon"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaTags style={iconStyle} /> Coupons
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/order"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaShoppingCart style={iconStyle} /> Order
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/customer"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaUsers style={iconStyle} /> Customer
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/delivery"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaTruck style={iconStyle} /> Delivery
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/delivery-accept"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaRegistered style={iconStyle} /> D Registered
            </ListGroup.Item>
            <ListGroup.Item
              action
              as={Link}
              to="/analytics"
              onClick={handleClose}
              style={listItemStyle}
            >
              <FaChartBar style={iconStyle} /> Analytics
            </ListGroup.Item>
            <ListGroup.Item
              action
              onClick={handleClose}
              className="mt-2"
              style={listItemStyle}
            >
              <Logout />
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
