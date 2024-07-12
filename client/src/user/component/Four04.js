import React from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function Four04() {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="display-1">404</h1>
      <h4 className="mb-4">Oops! Page not found.</h4>
      <p className="mb-4">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Button
        as={Link}
        to="/"
        variant="primary"
        className="mt-3"
        onClick={() => navigate("/")}
      >
        Go back to Home
      </Button>
    </Container>
  );
}

export default Four04;
