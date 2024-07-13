import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetSingleUsers, userOrders } from "./API";
import { Container, Card, Button, Spinner, Col, Row } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function UserInfo() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [productData, setProductData] = useState(null);
  const [purchaseDayData, setPurchaseDayData] = useState(null);
  const [totalProductsOrdered, setTotalProductsOrdered] = useState(0);
  const [totalMoneySpent, setTotalMoneySpent] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchUser();
  }, []);

  useEffect(() => {
    if (orders?.length > 0) {
      calculateTotals(orders);
      generateProductData(orders);
      generatePurchaseDayData(orders);
    }
  }, [orders]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await userOrders(id);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoadingOrders(false);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const response = await GetSingleUsers(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setLoadingUser(false);
  };

  const calculateTotals = (orders) => {
    let totalProducts = 0;
    let totalAmount = 0;

    orders?.forEach((order) => {
      order?.products.forEach((productItem) => {
        totalProducts += productItem.quantity;
        totalAmount += productItem.quantity * productItem.product.discountPrice;
      });
    });

    setTotalProductsOrdered(totalProducts);
    setTotalMoneySpent(totalAmount);
  };

  const generateProductData = (orders) => {
    const productCount = {};
    orders?.forEach((order) => {
      order?.products.forEach((productItem) => {
        const productName = productItem.product.name;
        if (productCount[productName]) {
          productCount[productName]++;
        } else {
          productCount[productName] = 1;
        }
      });
    });

    const labels = Object.keys(productCount);
    const data = Object.values(productCount);

    const productChartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Purchases",
          data: data,
          backgroundColor: "#3f51b5",
        },
      ],
    };

    setProductData(productChartData);
  };

  const generatePurchaseDayData = (orders) => {
    const dayCount = {};
    orders?.forEach((order) => {
      const orderDate = new Date(order.orderDate);
      const dayOfWeek = orderDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      if (dayCount[dayOfWeek]) {
        dayCount[dayOfWeek]++;
      } else {
        dayCount[dayOfWeek] = 1;
      }
    });

    const labels = Object.keys(dayCount);
    const data = Object.values(dayCount);

    const purchaseDayChartData = {
      labels: labels,
      datasets: [
        {
          label: "Number of Purchases",
          data: data,
          backgroundColor: "#4caf50",
        },
      ],
    };

    setPurchaseDayData(purchaseDayChartData);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <Container className="my-3">
      <Button
        variant="primary"
        onClick={() => navigate("/customer")}
        className="mb-4"
      >
        Go Back
      </Button>
      {loadingUser ? (
        <Spinner animation="border" />
      ) : (
        <Row className="mb-4">
          <Col xs={12} md={6}>
            <h4 style={{ color: "#f78000" }}>User Information</h4>
            <h6>Name: {user.name}</h6>
            <p>Email: {user.email}</p>
            <p style={{ maxWidth: "500px" }}>MapAddress: {user.MapAddress}</p>
            <p>Address: {user.address}</p>
            <p>Phone: {user.phone}</p>
          </Col>
          <Col xs={12} md={6}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "orange",
                }}
              >
                <p style={{ fontWeight: "bolder", fontSize: "30px" }}>
                  {totalProductsOrdered}
                </p>
                <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
                  Total Products
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "200px",
                  height: "200px",
                  borderRadius: "50%",
                  color: "white",
                  textAlign: "center",
                  backgroundColor: "orange",
                }}
              >
                <p style={{ fontWeight: "bolder", fontSize: "30px" }}>
                  {totalMoneySpent}
                </p>
                <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
                  Money Spent
                </p>
              </div>
            </div>
          </Col>
        </Row>
      )}

      <Card className="mb-3">
        <Card.Body>
          <Card.Title style={{ color: "#913b3bfc", textAlign: "center" }}>
            Highly Purchased Products
          </Card.Title>
          {productData ? (
            <Bar
              style={{ maxHeight: "60vh" }}
              data={productData}
              options={chartOptions}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-3" style={{ border: "none" }}>
        <Card.Body>
          <Card.Title
            className=" mb-4"
            style={{
              color: "#913b3bfc",
              textAlign: "center",
              fontSize: "30px",
            }}
          >
            My Orders
          </Card.Title>
          {loadingOrders ? (
            <Spinner animation="border" />
          ) : orders?.length > 0 ? (
            orders?.map((order, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Text>
                    <strong>Order Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleString()}
                  </Card.Text>
                  <Card.Text>
                    <strong>Payment Status:</strong>{" "}
                    <span
                      style={{
                        color:
                          order.paymentStatus === "completed" ? "green" : "red",
                      }}
                    >
                      {order.paymentStatus}
                    </span>
                  </Card.Text>
                  <Card.Text>
                    <strong>Coupon Discount:</strong> - Rs.{order.coupon || 0}
                  </Card.Text>
                  <Card.Text>
                    <strong>Total:</strong> Rs.{order.total}
                  </Card.Text>
                  {order.deliveredTime && (
                    <>
                      <Card.Text>
                        <strong>Picked Date:</strong>{" "}
                        {new Date(order.Picked).toLocaleString("en-US", {
                          hour12: true,
                        })}
                      </Card.Text>
                      <Card.Text>
                        <strong>Delivered Date:</strong>{" "}
                        {new Date(order.deliveredTime).toLocaleString("en-US", {
                          hour12: true,
                        })}
                      </Card.Text>
                      <Card.Text>
                        <strong>Delivery Man:</strong> {order.deliveryMan}
                      </Card.Text>
                      <Card.Text>
                        <strong>Delivery Man Contact:</strong>{" "}
                        {order.deliveryManContact}
                      </Card.Text>
                    </>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {order.products.map((productItem, idx) => (
                      <Card
                        key={idx}
                        className="mb-2"
                        style={{
                          maxWidth: "250px",
                          width: "100%",
                          margin: "20px",
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src={productItem.product.photo[0]}
                          style={{
                            width: "100%",
                            height: "200px",
                            objectFit: "cover",
                          }}
                        />
                        <Card.Body>
                          <Card.Title>{productItem.product.name}</Card.Title>
                          <Card.Text>
                            Price: Rs.{productItem.product.discountPrice}
                          </Card.Text>
                          <Card.Text>
                            Quantity: {productItem.quantity}
                          </Card.Text>
                          <Card.Text>
                            Status:{" "}
                            <span
                              style={{
                                color:
                                  productItem.orderStatus !== "created"
                                    ? "green"
                                    : "orange",
                              }}
                            >
                              {productItem.orderStatus}
                            </span>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title style={{ color: "#913b3bfc", textAlign: "center" }}>
            Purchase Statistics by Day
          </Card.Title>
          {purchaseDayData ? (
            <Bar
              style={{ maxHeight: "60vh" }}
              data={purchaseDayData}
              options={chartOptions}
            />
          ) : (
            <p>Loading...</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UserInfo;
