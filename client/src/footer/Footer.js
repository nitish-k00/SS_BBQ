import React from "react";
import { Container } from "react-bootstrap";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../style/footerContent.css";

function Footer() {
  return (
    <div className="bg-dark py-5 text-light mt-1">
      <Container>
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4>ABOUT</h4>
            <Link to="/about" className="nav-link text-light social-icon">
              Who We Are
            </Link>
            <Link to="/contact" className="nav-link text-light social-icon">
              Contact Us
            </Link>
            <Link to="/location" className="nav-link text-light social-icon">
              Location
            </Link>
          </div>
          <div className="col-md-4 mb-4">
            <h4>LEARN MORE</h4>
            <Link to="/privacy" className="nav-link text-light social-icon">
              Privacy
            </Link>
            <Link to="/security" className="nav-link text-light social-icon">
              Security
            </Link>
            <Link to="/terms" className="nav-link text-light social-icon">
              Terms
            </Link>
          </div>
          <div className="col-md-4">
            <h4>SOCIAL LINKS</h4>
            <div className="d-flex align-items-center mt-3">
              <FaInstagram
                style={{
                  fontSize: 25,
                  color: "#C13584",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FaFacebook
                style={{
                  fontSize: 25,
                  color: "#1877F2",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FaEnvelope
                style={{
                  fontSize: 25,
                  color: "#EA4335",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          <div className="col rights">
            <h4> All Rights Under @ NITISH K</h4>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Footer;
