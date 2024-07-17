import React, { useEffect, useState } from "react";
import "../../index.css";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/slices/userInfo";
import { FaRegHeart } from "react-icons/fa";
import { addAndRemoveFav, addToCart } from "./API";

function ProductBox({ product, favID, holeFav, setProductFiltered }) {
  const { login } = useSelector(selectUserInfo);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [favcol, setFavcol] = useState(false);

  const fetchAddToCart = async (productId) => {
    setLoading(true);
    try {
      if (login) {
        await addToCart(productId);
      } else {
        navigate("/login");
      }
    } catch (error) {
      //console.log(error);
    }
    setLoading(false);
  };

  const fetchAddAndRemoveFav = async (productId) => {
    setFavLoading(true);
    try {
      if (login) {
        const data = await addAndRemoveFav(productId);
        await holeFav();
        setFavLoading(false);
        setFavcol(!favcol);
        setProductFiltered(data);
      } else {
        navigate("/login");
      }
    } catch (error) {
      //console.log(error);
    }
    setFavLoading(false);
  };

  const fetchFavColour = async () => {
    setFavcol(favID.some((data) => data === product._id));
  };

  useEffect(() => {
    fetchFavColour();
  }, [fetchAddAndRemoveFav]);

  return (
    <div>
      <div
        className="card me-4 mb-4"
        style={{
          width: "16rem",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
        }}
        key={product._id}
      >
        <img
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            cursor: "pointer",
          }}
          src={product.photo[0]}
          className="card-img-top"
          alt={product.name}
          onClick={() => navigate(`/menu/${product._id}`)}
        />
        <div className="card-body">
          <h5 className="card-title">
            {product?.name}
            <span>
              {product?.quantity === 0 || !product?.available ? (
                <p className="mt-1" style={{ color: "red", fontSize: "15px" }}>
                  Out of Stock
                </p>
              ) : product?.quantity <= 10 ? (
                <p className="mt-1" style={{ color: "red", fontSize: "15px" }}>
                  only {product?.quantity} available{" "}
                </p>
              ) : (
                <p
                  className="mt-1"
                  style={{ color: "red", height: "15px" }}
                ></p>
              )}
            </span>
          </h5>
          <p className="card-text">
            {product?.description.substring(0, 40)}...
          </p>
          <div style={{ display: "flex" }}>
            <div style={{ position: "relative" }}>
              {product?.discount !== 0 && <div className="cross"></div>}
              <p
                className={`card-text ${
                  product?.discount ? "price" : "h5 bold"
                }`}
              >
                Rs.{product?.price}
              </p>
            </div>
            {product?.discount !== 0 && (
              <>
                <p className="mx-3 card-text h5">Rs.{product?.discountPrice}</p>
                <p className="card-text" style={{ color: "green" }}>
                  ({product?.discount} % off)
                </p>
              </>
            )}
          </div>

          <div className=" d-flex mt-3">
            <button
              className="btn btn-primary "
              disabled={
                product?.quantity === 0 || !product?.available || loading
              }
              onClick={() => fetchAddToCart(product._id)}
            >
              {loading ? (
                <>
                  <span className="me-1"> Add to cart </span>
                  <Spinner
                    animation="border"
                    size="sm"
                    role="status"
                    style={{ color: "white" }}
                  />
                </>
              ) : (
                " Add to cart"
              )}
            </button>

            {favLoading ? (
              <Spinner
                animation="border"
                size="md"
                role="status"
                style={{
                  color: "black",
                  marginLeft: "20px",
                }}
              />
            ) : (
              <FaRegHeart
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "4px",
                  marginLeft: "20px",
                  cursor: "pointer",
                  color: favcol ? "red" : "",
                }}
                onClick={() => fetchAddAndRemoveFav(product._id)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductBox;
