import React from "react";
import FooterContent from "./FooterContent";
import { Route } from "react-router-dom";

const footerRoutes = [
  <Route
    key="about"
    path="/about"
    element={<FooterContent section="who-we-are" />}
  />,
  <Route
    key="contact"
    path="/contact"
    element={<FooterContent section="contact-us" />}
  />,
  <Route
    key="location"
    path="/location"
    element={<FooterContent section="location" />}
  />,
  <Route
    key="privacy"
    path="/privacy"
    element={<FooterContent section="privacy" />}
  />,
  <Route
    key="security"
    path="/security"
    element={<FooterContent section="security" />}
  />,
  <Route
    key="terms"
    path="/terms"
    element={<FooterContent section="terms" />}
  />,
];

export default footerRoutes;
