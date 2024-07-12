import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ForgotPasswordProtrcted({ children }) {
  const location = useLocation();
  //   console.log(location);
  //   console.log(location.state);

  if (location.state?.forgotPassword) {
    return children;
  } else if (location.state?.forgotPasswordEmail) {
    return children;
  } else if (location.state?.otp) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default ForgotPasswordProtrcted;
