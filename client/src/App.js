import Footer from "./footer/Footer";
import NavBar from "./user/main-Component/NavBar";
import ANavbar from "./Admin/main-component/ANavbar";
import ARouteLinks from "./Admin/route/ARoute";

import { BrowserRouter as Router } from "react-router-dom";
import RouteLinks from "./user/route/Route";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserInfo } from "./redux/slices/userInfo";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DNavBar from "./delivery/main-component/DNavBar";
import DRoutes from "./delivery/routes/DRoutes";


axios.defaults.withCredentials = true;

function App() {
  const user = useSelector(selectUserInfo);
  console.log(user);

  return (
    <div>
      <Router>
        {user.role === 1 ? (
          <>
            <ANavbar />
            <ARouteLinks />
          </>
        ) : user.role === 2 ? (
          <>
            <DNavBar />
            <DRoutes />
          </>
        ) : (
          <>
            <NavBar />
            <RouteLinks />
          </>
        )}
        <Footer />
        <ToastContainer autoClose={1000} />
      </Router>
    </div>
  );
}

export default App;
