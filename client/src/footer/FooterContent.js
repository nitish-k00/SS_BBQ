import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "../style/footerContent.css";

function FooterContent({ section }) {
  const location = useLocation();

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, section]);

  return (
    <Container className="footer-content custom-width">
      <Row className="mt-3 section-row">
        <Col id="who-we-are">
          <div className="d-flex mb-5  align-items-center">
            <img
              className="me-3"
              src="./img/logo.png"
              style={{ width: "70px", height: "auto" }}
            />
            <div>
              <h1
                style={{
                  fontSize: "50px",
                  fontWeight: "bolder",
                  backgroundColor: "",
                }}
              >
                SS BBQ
              </h1>
            </div>
          </div>

          <h2 className={location.pathname === "/about" ? "highlighted" : ""}>
            WHO WE ARE
          </h2>
          <p>
            At SS BBQ, we are passionate about delivering the authentic taste of
            barbecue to our customers. Born from a love of smoked meats and
            traditional BBQ flavors, we have dedicated ourselves to perfecting
            the art of barbecue. Our team of seasoned pitmasters uses only the
            finest ingredients and time-honored techniques to create
            mouthwatering dishes that keep our customers coming back for more.
            Whether you're a barbecue aficionado or a newcomer to the world of
            smoked delights, SS BBQ is here to provide a culinary experience
            like no other.
          </p>
        </Col>
      </Row>

      <Row className="mt-5 section-row">
        <Col id="contact-us">
          <h2 className={location.pathname === "/contact" ? "highlighted" : ""}>
            CONTACT US
          </h2>
          <p>
            We'd love to hear from you! Whether you have questions about our
            menu, need catering for your next event, or simply want to share
            your experience, our team is here to assist you.
          </p>
          <p>
            Email: <a href="mailto:contact@ssbbq.com">contact@ssbbq.com</a>
          </p>
          <p>Phone: (555) 123-4567</p>
          <p>
            Social Media: Follow us on Facebook, Instagram, and Twitter @SSBBQ.
          </p>
        </Col>
      </Row>

      <Row className="mt-5 section-row">
        <Col id="location">
          <h2
            className={location.pathname === "/location" ? "highlighted" : ""}
          >
            LOCATION
          </h2>
          <p>
            SS BBQ is conveniently located in the heart of downtown, making it
            easy for you to satisfy your barbecue cravings. Come visit us and
            enjoy our cozy, family-friendly atmosphere.
          </p>
          <p>Address: 123 BBQ Lane, Flavor Town, USA</p>
          <p>Hours: Monday-Saturday: 11 AM - 10 PM, Sunday: 11 AM - 8 PM</p>
        </Col>
      </Row>

      <Row className="mt-5 section-row">
        <Col id="privacy">
          <h2 className={location.pathname === "/privacy" ? "highlighted" : ""}>
            PRIVACY
          </h2>
          <p>
            Your privacy is important to us. SS BBQ is committed to protecting
            your personal information and ensuring that your experience with us
            is safe and secure. We do not share or sell your data to third
            parties. For more details, please review our full Privacy Policy on
            our website.
          </p>
        </Col>
      </Row>

      <Row className="mt-5 section-row">
        <Col id="security">
          <h2
            className={location.pathname === "/security" ? "highlighted" : ""}
          >
            SECURITY
          </h2>
          <p>
            At SS BBQ, we take your security seriously. Our website and payment
            systems are equipped with the latest encryption technologies to
            safeguard your personal and financial information. We continuously
            monitor and update our security measures to provide you with a
            worry-free dining and online experience.
          </p>
        </Col>
      </Row>

      <Row className="mt-5 mb-5 section-row">
        <Col id="terms">
          <h2 className={location.pathname === "/terms" ? "highlighted" : ""}>
            TERMS
          </h2>
          <p>
            By using our services, you agree to our terms and conditions. These
            include guidelines on the use of our website, our policies on orders
            and cancellations, and our commitment to quality and customer
            satisfaction. For more information, please read our Terms of Service
            on our website.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default FooterContent;
