import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "../component/Login";
import Cart from "../component/Cart";
import Home from "../component/Home";
import Menu from "../component/Menu";
import Profile from "../component/Profile";
import Register from "../component/Register";
import Favourite from "../component/Favourite";
import Four04 from "../component/Four04";
import Orders from "../component/Orders";
//
import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";
import SingleProductPage from "../component/SingleProductPage";
import PlaceOrder from "../component/PlaceOrder";

//
import CartProtrcted from "../protrctedRoute/CartProtrcted";
import ForgotPasswordProtrcted from "../protrctedRoute/ForgotPasswordProtrcted";

//

import EnterEmail from "../forgotPassword/EnterEmail";
import EnterNewPassword from "../forgotPassword/EnterNewPassword";
import EnterOtp from "../forgotPassword/EnterOtp";

import footerRoutes from "../../footer/FooterRoutes";
import LogRegDelivery from "../Delivery/LogRegDelivery";

function RouteLinks() {
  const { login, role } = useSelector(selectUserInfo);

  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        {!login && !role && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/LogRegDelivery" element={<LogRegDelivery />} />
          </>
        )}

        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/favourites" element={<Favourite />} />
        <Route path="*" element={<Four04 />} />
        <Route path="/menu/:id" element={<SingleProductPage />} />
        <Route path="/Orders" element={<Orders />} />
        <Route
          path="/placeorder"
          element={
            <CartProtrcted>
              <PlaceOrder />
            </CartProtrcted>
          }
        />

        <Route
          path="/forgotPassword"
          element={
            <ForgotPasswordProtrcted>
              <EnterEmail />
            </ForgotPasswordProtrcted>
          }
        />
        <Route
          path="/forgotPasswordOTP"
          element={
            <ForgotPasswordProtrcted>
              <EnterOtp />
            </ForgotPasswordProtrcted>
          }
        />
        <Route
          path="/newPassword"
          element={
            <ForgotPasswordProtrcted>
              <EnterNewPassword />
            </ForgotPasswordProtrcted>
          }
        />

        {footerRoutes.map((route) => route)}
      </Routes>
    </div>
  );
}

export default RouteLinks;
