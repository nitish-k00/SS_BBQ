import React, { useState } from "react";
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

  const handleLoginClick = () => {
    handleClose();
    navigate("/login");
  };

  const handleRegisterClick = () => {
    handleClose();
    navigate("/register");
  };

  const handleLogout = () => {
    if (window.innerWidth < 992) {
      // For small screens, keep the navbar open
      setExpanded(false);
    }
  };

  return (
    <Navbar variant="dark" expand="lg" expanded={expanded} className="main">
      <Container>
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
            SS/BBQ
          </span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle}
          style={{ border: "none" }}
        />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className="ms-auto mb-2 mb-lg-0">
            {pages.map((page) => (
              <Nav.Link
                as={Link}
                to={`/${page.toLowerCase()}`}
                key={page}
                onClick={handleClose}
                className="nav-link-custom"
                style={{
                  color: "white",
                  fontWeight: "bold",
                  borderBottom:
                    location.pathname === `/${page.toLowerCase()}`
                      ? "2px solid orangeRed"
                      : "none",
                  marginLeft: "10px",
                }}
              >
                {page}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="ms-auto">
            {login ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="link"
                  bsPrefix="p-0"
                  style={{ border: "none" }}
                >
                  <Image
                    src={avatar || "/img/default-avatar.png"}
                    roundedCircle
                    width="40"
                    height="40"
                    alt="User Avatar"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-2">
                  <Dropdown.Item
                    as={Link}
                    to="/profile"
                    onClick={handleClose}
                    className="dropdown-item-custom"
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to="/orders"
                    onClick={handleClose}
                    className="dropdown-item-custom"
                  >
                    Orders
                  </Dropdown.Item>
                  <Dropdown.Item className="dropdown-item-custom">
                    <Logout onLogout={handleLogout} />
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex align-items-center">
                <Nav.Link
                  onClick={handleLoginClick}
                  className="nav-link-custom"
                  style={{ marginLeft: "10px" }}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  onClick={handleRegisterClick}
                  className="nav-link-custom"
                  style={{ marginLeft: "10px" }}
                >
                  Register
                </Nav.Link>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
