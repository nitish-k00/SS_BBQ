import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { FaInstagram, FaFacebook, FaEnvelope } from "react-icons/fa";
import "../../index.css";

import { useDispatch, useSelector } from "react-redux";
import { modifyUserInfo, selectUserInfo } from "../../redux/slices/userInfo";

import { jwtDecode } from "jwt-decode";
import { getFavColours, profileInfo, specialProduct } from "../middleware/API";
import ProductBox from "../middleware/ProductBox";
import { useLocation } from "react-router-dom";

function Home() {
  const dispatch = useDispatch();

  const [specialProducts, setSpecialProducts] = useState([]);
  const [specialProductLoding, setSpecialProductLoding] = useState(false);
  const [favID, setFavId] = useState([]);
  const [loading, setLoading] = useState(false);

  const userData = useSelector(selectUserInfo);
  const location = useLocation();

  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  console.log(BASE_URL, "back");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const token =
          searchParams.get("token") || localStorage.getItem("token");

        if (!token) {
          console.log("No token found in query parameters or local storage.");
          return;
        }

        const decodedJWT = jwtDecode(token);
        console.log(decodedJWT);

        localStorage.setItem("token", token); // Save token to local storage
        setLoading(true);
        let userData;

        try {
          console.log("Fetching profile info...");
          userData = await profileInfo();
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setLoading(false);
          return; // Stop further execution if fetching profile info fails
        }

        setLoading(false);
        console.log(userData);
        dispatch(
          modifyUserInfo({
            name: userData.name,
            email: userData.email,
            address: userData.address,
            phoneNo: userData.phoneNo || userData.phone,
            avatar: userData.avator || userData.avatar,
            latitude: userData.latitude || "",
            longitude: userData.longitude || "",
            MapAddress: userData.MapAddress || "",
            role: decodedJWT.role,
            login: true,
            accepted: userData.accepted,
            blocked: userData.blocked,
          })
        );

        searchParams.delete("token");
        const newSearch = searchParams.toString();
        const newUrl = `${location.pathname}${
          newSearch ? `?${newSearch}` : ""
        }`;
        window.history.replaceState({}, "", newUrl);

        console.log(newUrl);
      } catch (error) {
        console.error("Error fetching profile info:", error);
      }
    };

    fetchData();
  }, [dispatch, location.search]);

  useEffect(() => {
    const fetchSepicalProducts = async () => {
      setSpecialProductLoding(true);
      try {
        const SpecialP = await specialProduct();
        setSpecialProducts(SpecialP);
      } catch (error) {
        console.log(error);
      }
      setSpecialProductLoding(false);
    };
    fetchSepicalProducts();
  }, []);

  const holeFav = async () => {
    try {
      const data = await getFavColours();
      setFavId(data);
      console.log("called", data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?.login) {
      holeFav();
    }
  }, [userData]);

  if (loading) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Spinner />
        <span
          className="ms-2"
          style={{ fontWeight: "bolder", fontSize: "20px" }}
        >
          {" "}
          LOADING...
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      className="bg mb-5"
    >
      <Container
        style={{
          width: "100%",
          marginTop: "5vh",
        }}
      >
        <div className="row ">
          <div className="col-md pb-5">
            <h1 style={{ fontSize: "6rem", fontWeight: 700 }} className="head ">
              SS;
            </h1>
            <h2
              className="pa"
              style={{
                fontSize: "4rem",
                fontWeight: 700,
              }}
            >
              BARBEQUE
            </h2>

            <div
              style={{
                width: "70%",
                margin: "80px auto",
                padding: "20px",
                borderRadius: "10px",
                position: "relative",
              }}
              className="bg2"
            >
              <div className="box1"></div>
              <p
                variant="body1"
                style={{
                  textAlign: "center",
                  fontFamily: "Arial",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                <div className="text-start">
                  <h3 style={{ fontWeight: "bolder" }}>
                    <img
                      className=""
                      src="/img/add.png"
                      style={{ width: "25%" }}
                      alt="BBQ Bliss Awaits"
                    ></img>
                    BBQ Bliss Awaits!
                  </h3>
                </div>
                " Smoky, succulent, and savory, BBQ tantalizes taste buds with
                its charred perfection "
              </p>
            </div>
            <div className="mt-5">
              <FaInstagram
                style={{
                  fontSize: 40,
                  color: "#C13584",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FaFacebook
                style={{
                  fontSize: 40,
                  color: "#1877F2",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
              <FaEnvelope
                style={{
                  fontSize: 40,
                  color: "#EA4335",
                  margin: "0 10px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          <div className="col-md col-xl-5 d-flex justify-content-center align-items-center">
            <div
              style={{
                backgroundColor: "#f78000",
                borderRadius: "30% 70% 74% 26% / 32% 67% 33% 68%",
                width: "100%",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <img
                src="img/bbq-removebg-preview.png"
                style={{
                  width: "80%",
                  borderRadius: "10px",
                }}
                alt="BBQ"
              />
            </div>
          </div>
        </div>

        <Container className="mt-3">
          <div className="my-5 ms-4">
            {specialProductLoding ? (
              <Spinner />
            ) : (
              specialProducts.length !== 0 && (
                <div>
                  <h3 className="pa h1" style={{fontWeight:"bolder"}}>SPEICAL OF THE DAY :</h3>
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start mt-5">
                    {specialProducts.map((product) => (
                      <ProductBox
                        key={product._id}
                        favID={favID}
                        holeFav={holeFav}
                        product={product}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default Home;
