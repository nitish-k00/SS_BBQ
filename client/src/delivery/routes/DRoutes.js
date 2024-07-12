import React from "react";
import { Route, Routes } from "react-router-dom";
import Four04 from "../../user/component/Four04";
import DProfile from "../component/DProfile";
import DDelivered from "../component/DDelivered";
import DOnDelivery from "../component/DOnDelivery";
import DOrders from "../component/DOrders";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/slices/userInfo";

function DRoutes() {
  const { accepted, blocked } = useSelector(selectUserInfo);

  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<DOrders />} />
        <Route path="/profile" element={<DProfile />} />
        <Route path="*" element={<Four04 />} />
        {accepted && !blocked && (
          <>
            <Route path="/delivery" element={<DOnDelivery />} />
            <Route path="/deliverd" element={<DDelivered />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default DRoutes;
