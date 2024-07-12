import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function CartProtrcted({ children }) {
  const location = useLocation();
  //   console.log(location);
  //   console.log(location.state);

  if (location.state?.fromCart) {
    return children;
  } else if (location.state?.fromPlaceOrder) {
    return children;
  } else {
    return <Navigate to="/cart" />;
  }
}

export default CartProtrcted;
