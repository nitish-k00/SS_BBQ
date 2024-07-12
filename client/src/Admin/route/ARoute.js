//
import ADashboard from "../components/ADashboard";
import ACategory from "../components/ACategory";
import AProduct from "../components/AProduct";
import AOrder from "../components/AOrder";
import ACustomer from "../components/ACustomer";
import { Route, Routes } from "react-router-dom";
import Profile from "../../user/component/Profile";
import Four04 from "../../user/component/Four04";
import ACoupon from "../components/ACoupon";
import OrderDetail from "../middleware/OrderInfoTable";
import UserInfo from "../middleware/UserInfo";
import AAnalytics from "../components/AAnalytics";
import ADelivery from "../components/ADelivery";
import DeliveryManInfo from "../middleware/DeliveryManInfo";
import ADeliveryAccepect from "../components/ADeliveryAccepect";

function ARouteLinks() {
  return (
    <div
      style={{
        minHeight: "93vh",
        width: "100%",
      }}
    >
      <Routes>
        <Route path="/" element={<ADashboard />} />
        <Route path="/dashboard" element={<ADashboard />} />
        <Route path="/category" element={<ACategory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<AProduct />} />
        <Route path="/order" element={<AOrder />} />
        <Route path="/singleOrder/:id" element={<OrderDetail />} />
        <Route path="/userInfo/:id" element={<UserInfo />} />
        <Route path="/deliveryInfo/:id" element={<DeliveryManInfo />} />
        <Route path="/customer" element={<ACustomer />} />
        <Route path="/coupon" element={<ACoupon />} />
        <Route path="/analytics" element={<AAnalytics />} />
        <Route path="/delivery" element={<ADelivery />} />
        <Route path="/delivery-accept" element={<ADeliveryAccepect />} />
        <Route path="*" element={<Four04 />} />
      </Routes>
    </div>
  );
}

export default ARouteLinks;
