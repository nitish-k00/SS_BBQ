import React, { useEffect, useState } from "react";
import ProductBox from "../middleware/ProductBox";
import { getFav, getFavColours } from "../middleware/API";
import { Button, Container, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { selectUserInfo } from "../../redux/slices/userInfo";
import { useSelector } from "react-redux";

function Favourite() {
  const [productFiltered, setProductFiltered] = useState([]);
  const [favID, setFavId] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userData = useSelector(selectUserInfo);
  // console.log(productFiltered,"p")

  const fetchFav = async () => {
    setLoading(true);
    try {
      const data = await getFav();
      setProductFiltered(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

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
      fetchFav();
    }
  }, [userData]);

  return (
    <div className="mt-5">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner animation="border" />
          <span>
            <p className="ms-2 h1">Loading....</p>
          </span>
        </div>
      ) : (
        <>
          <Container>
            <h2
              className="ms-5 mb-5 mt-3"
              style={{
                width: "100%",
                fontWeight: "bold",
                color: "#f78000",
                fontSize: "40px",
              }}
            >
              Favourite's
            </h2>
          </Container>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              justifyContent: "center",
            }}
          >
            {productFiltered?.length !== 0 ? (
              productFiltered?.map((product) => (
                <ProductBox
                  key={product._id}
                  product={product}
                  favID={favID}
                  holeFav={holeFav}
                  setProductFiltered={setProductFiltered}
                />
              ))
            ) : (
              <div>
                <h5
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    color: "gray",
                    marginTop: "20px",
                  }}
                >
                  NO PRODUCT FOUND
                </h5>
                <Button
                  className="mt-3 bg-success "
                  onClick={() => navigate("/menu")}
                >
                  ADD YOUR FAVOURTIE
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Favourite;
