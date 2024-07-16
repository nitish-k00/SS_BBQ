import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/slices/userInfo";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Offcanvas,
  Image,
  ListGroup,
} from "react-bootstrap";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaUserCircle,
  FaHome,
  FaTruck,
  FaInbox,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Logout from "../../user/component/logout";

const drawerWidth = 260;

export default function PersistentDrawerLeft() {
  const [open, setOpen] = useState(false);
  const { accepted, blocked, avatar } = useSelector(selectUserInfo);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const iconStyle = { marginRight: "10px", color: "#007bff" };
  const listItemStyle = { padding: "10px 20px", fontSize: "16px" };

  return (
    <div style={{ height: "10vh" }}>
      <Navbar expand="lg" fixed="top" style={{ backgroundColor: "#f78000" }}>
        <Container fluid>
          <Button
            variant="link"
            onClick={handleDrawerOpen}
            className={!open ? "" : "d-none"}
          >
            <FaBars style={{ color: "black" }} />
          </Button>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <Image
              src="/img/logo.png"
              width="40"
              className="d-inline-block align-top"
              alt="Logo"
            />
            <span
              className="ms-2"
              style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
            >
              SS/BBQ DELIVERY
            </span>
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Offcanvas
        show={open}
        onHide={handleDrawerClose}
        style={{ width: drawerWidth }}
      >
        <Offcanvas.Header closeButton>
          <Button variant="link" onClick={handleDrawerClose}>
            {open ? <FaChevronLeft /> : <FaChevronRight />}
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="ms-4 mb-4">
            <Image
              src={avatar}
              roundedCircle
              style={{
                width: "150px",
                height: "150px",
                border: "4px solid #007bff",
              }}
            />
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item
              action
              as={Link}
              to="/profile"
              onClick={handleDrawerClose}
              style={listItemStyle}
            >
              <FaUserCircle style={iconStyle} /> Profile
            </ListGroup.Item>
            <ListGroup.Item
              style={listItemStyle}
              action
              as={Link}
              to="/"
              onClick={handleDrawerClose}
            >
              <FaHome style={iconStyle} /> Orders
            </ListGroup.Item>
            {accepted && !blocked && (
              <>
                <ListGroup.Item
                  action
                  as={Link}
                  to="/delivery"
                  onClick={handleDrawerClose}
                  style={listItemStyle}
                >
                  <FaTruck style={iconStyle} /> On Delivery
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  as={Link}
                  to="/deliverd"
                  onClick={handleDrawerClose}
                  style={listItemStyle}
                >
                  <FaInbox style={iconStyle} /> Delivered
                </ListGroup.Item>
              </>
            )}
            <ListGroup.Item className="mt-3">
              <Logout />
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
