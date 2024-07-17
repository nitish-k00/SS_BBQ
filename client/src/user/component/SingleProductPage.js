import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addAndRemoveFav,
  addToCart,
  getFavColours,
  relatedProducted,
  singleProduct,
} from "../middleware/API";
import { Container, Spinner } from "react-bootstrap";
import ProductBox from "../middleware/ProductBox";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/slices/userInfo";
import { FaHeart } from "react-icons/fa"; // Importing React Icons

function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useSelector(selectUserInfo);

  const [favLoading, setFavLoading] = useState(false);
  const [favcol, setFavcol] = useState(false);
  const [favID, setFavId] = useState([]);

  const fetchAddAndRemoveFav = async (productId) => {
    setFavLoading(true);
    try {
      if (login) {
        await addAndRemoveFav(productId);
        await fetchFavColour();
        setFavcol(!favcol);
      } else {
        navigate("/login");
      }
    } catch (error) {
      //console.log(error);
    }
    setFavLoading(false);
  };

  const fetchFavColour = async () => {
    try {
      const data = await getFavColours();
      if (data && data.length > 0) {
        setFavcol(data?.some((data) => data === id));
        setFavId(data);
      } else {
        setFavcol(false);
      }
    } catch (error) {
      //console.log(error);
    }
  };

  useEffect(() => {
    if (login) {
      fetchFavColour();
    }
  }, [login]);

  const fetchSingleProduct = async () => {
    setLoading(true);
    try {
      const product = await singleProduct(id);
      setProduct([product]);
    } catch (error) {
      //console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSingleProduct();
    window.scrollTo(0, 0); // Scroll to the top when component mounts
  }, [id]);

  useEffect(() => {
    const fetchRelatedProduct = async () => {
      setRelatedLoading(true);
      if (!product.length) return;
      const cateName = product[0].category.name;
      const productId = product[0]._id;
      try {
        const productCategory = await relatedProducted(cateName);
        if (productCategory && productCategory.length > 0) {
          const relatedProducts = productCategory.filter(
            (data) => data._id !== productId
          );
          setRelatedProduct(relatedProducts);
        } else {
          //console.log("No related products found.");
          setRelatedProduct([]);
        }
      } catch (error) {
        //console.log(error);
      }
      setRelatedLoading(false);
    };
    fetchRelatedProduct();
  }, [product]);

  const fetchAddToCart = async (productId) => {
    setLoadingCart(true);
    try {
      if (login) {
        await addToCart(productId);
      } else {
        navigate("/login");
      }
    } catch (error) {
      //console.log(error);
    }
    setLoadingCart(false);
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
          <p className="ms-2 h2">Loading....</p>
        </div>
      ) : (
        <Container>
          {product?.map((data) => (
            <div className="row mt-5">
              <div className="col-lg-7 d-md-flex flex-row-reverse">
                <div className="col mb-3 mx-4">
                  <div
                    className="d-flex justify-content-center align-items-center p-3 "
                    style={{
                      width: "100%",
                      minHeight: "400px",
                      boxShadow:
                        "rgba(136, 165, 191, 0.48) 6px 2px 16px 0px, rgba(255, 255, 255, 0.8) -6px -2px 16px 0px",
                    }}
                  >
                    <img
                      src={data?.photo[imgIndex]}
                      style={{
                        width: "100%",
                        height: "60vh",
                        objectFit: "contain",
                      }}
                      alt="Product"
                    />
                  </div>
                </div>
                <div className="col-md-3 col-xl-2  d-flex flex-md-column align-items-center">
                  {data?.photo?.map((image, index) => (
                    <div
                      className="m-3 p-1 "
                      key={index}
                      style={{
                        border: imgIndex === index ? "1px solid black" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <img
                        src={image}
                        style={{ width: "70px", height: "70px" }}
                        onClick={() => setImgIndex(index)}
                        alt={`Thumbnail ${index}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col my-3  mx-5">
                <h5 className="h1 mb-3 text">
                  {data.name}{" "}
                  <span>
                    {data?.quantity === 0 || !data?.available ? (
                      <p
                        className="mt-1"
                        style={{ color: "red", fontSize: "15px" }}
                      >
                        Out of Stock
                      </p>
                    ) : data?.quantity <= 10 ? (
                      <p
                        className="mt-1"
                        style={{ color: "red", fontSize: "15px" }}
                      >
                        only {data?.quantity} available{" "}
                      </p>
                    ) : (
                      ""
                    )}
                  </span>
                </h5>
                <div style={{ display: "flex" }} className="mb-4">
                  <div style={{ position: "relative" }}>
                    {data?.discount !== 0 && <div className="cross"></div>}
                    <p
                      className={`card-text ${data?.discount ? "price" : "h5"}`}
                    >
                      Rs.{data.price}
                    </p>
                  </div>
                  {data?.discount !== 0 && (
                    <>
                      <p className="mx-3 card-text h5">
                        Rs.{data?.discountPrice}
                      </p>
                      <p className="card-text" style={{ color: "green" }}>
                        ({data?.discount} % off)
                      </p>
                    </>
                  )}
                </div>

                <p style={{ width: "70%", wordBreak: "break-word" }}>
                  {data?.description}
                </p>

                <div className="mt-3 d-flex">
                  <button
                    className="btn btn-primary "
                    disabled={
                      data?.quantity === 0 || !data?.available || loadingCart
                    }
                    onClick={() => fetchAddToCart(data._id)}
                  >
                    {loadingCart ? (
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
                      style={{ color: "black", marginLeft: "20px" }}
                    />
                  ) : (
                    <FaHeart
                      style={{
                        width: "40px",
                        height: "30px",
                        borderRadius: "4px",
                        marginLeft: "20px",
                        cursor: "pointer",
                        color: favcol ? "red" : "",
                      }}
                      onClick={() => fetchAddAndRemoveFav(data._id)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </Container>
      )}
      <Container>
        <div className="my-5 ms-4">
          {relatedLoading ? (
            <Spinner />
          ) : (
            relatedProduct.length !== 0 && (
              <div>
                <h3 className="pa">SIMILAR PRODUCTS</h3>
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start mt-5">
                  {relatedProduct.map((product) => (
                    <ProductBox
                      key={product._id}
                      favID={favID}
                      holeFav={fetchFavColour}
                      product={product}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Container>
    </div>
  );
}

export default SingleProductPage;
