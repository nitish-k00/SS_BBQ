import React, { useState } from "react";
import "../../index.css";
import { Navbar, Nav, Container, Image, Dropdown } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logout from "../component/logout";
import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";

const pages = ["MENU", "FAVOURITES", "CART"];

function NavBar() {
  const { login, avatar } = useSelector(selectUserInfo);
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleClose = () => {
    setExpanded(false);
  };

  return (
    <Navbar variant="dark" expand="lg" expanded={expanded} className="main">
      <Container>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
          className="me-2"
        />
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <Image
            src="/img/logo.png"
            width="40"
            className="d-inline-block align-top"
            alt="Logo"
          />
          <span style={{ marginLeft: "10px" }}>SS/BBQ</span>
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0 ">
            {pages.map((page) => (
              <Nav.Link
                as={Link}
                to={`/${page.toLowerCase()}`}
                key={page}
                onClick={handleClose}
                className="p-2 mt-2"
                style={{
                  textDecoration: "none",
                  borderRadius:"20px",
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor:
                    location.pathname === `/${page.toLowerCase()}`
                      ? "#913b3bfc"
                      : "transparent",
                }}
              >
                {page}
              </Nav.Link>
            ))}
          </Nav>
          {login ? (
            <Dropdown align="end" className="ms-auto mb-2 mb-lg-0">
              <Dropdown.Toggle variant="link" bsPrefix="p-0">
                <Image src={avatar} roundedCircle width="40" height="40" />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile" onClick={handleClose}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/orders" onClick={handleClose}>
                  Orders
                </Dropdown.Item>
                <Dropdown.Item>
                  <Logout />
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Nav className="ms-auto mb-2 mb-lg-0">
              <Nav.Link
                onClick={() => navigate("/login")}
                style={{
                  cursor: "pointer",
                  fontWeight: "700",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Login
              </Nav.Link>
              <span
                className="mx-2"
                style={{ fontWeight: "700", color: "white" }}
              >
                /
              </span>
              <Nav.Link
                onClick={() => navigate("/register")}
                style={{
                  cursor: "pointer",
                  fontWeight: "700",
                  textDecoration: "none",
                  color: "white",
                }}
              >
                Register
              </Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
