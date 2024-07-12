import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GetDeliverySingleUsers, deliveryManOrders } from "./API";
import { Container, Card, Col, Row, Spinner } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

function DeliveryManInfo() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [user, setUser] = useState({});
  const [loadingUser, setLoadingUser] = useState(false);
  const [purchaseDayData, setPurchaseDayData] = useState(null);

  const navigate = useNavigate();

  // Example chart options
  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Day of Week",
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Number of Orders Delivered",
        },
        beginAtZero: true,
      },
    },
  };

  useEffect(() => {
    fetchOrders();
    fetchUser();
  }, []);

  useEffect(() => {
    if (orders?.length > 0) {
      generatePurchaseDayData(orders);
    }
  }, [orders]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await deliveryManOrders(id);
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoadingOrders(false);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const response = await GetDeliverySingleUsers(id);
      setUser(response);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    setLoadingUser(false);
  };

  const generatePurchaseDayData = (orders) => {
    const dayCount = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.deliverdTime);
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
          label: "Number of Orders Delivered",
          data: data,
          backgroundColor: "#4caf50",
        },
      ],
    };

    setPurchaseDayData(purchaseDayChartData);
  };

  return (
    <Container className="my-3">
      <button
        variant="primary"
        onClick={() => navigate("/delivery")}
        className="mb-4 btn btn-primary"
      >
        Go Back
      </button>
      <div className="mb-4">
        {loadingUser ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <Row>
            <Col md={6}>
              <h4 style={{ color: "#f78000" }}>User Information</h4>
              <h6>Name: {user?.name}</h6>
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.phone}</p>
            </Col>
            <Col md={6}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  height: "100%",
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
                    borderRadius: "20%",
                    color: "white",
                    textAlign: "center",
                    backgroundColor: "orange",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "bolder",
                      fontSize: "30px",
                      color: "black",
                    }}
                  >
                    {orders?.length || 0}
                  </p>
                  <p style={{ fontWeight: "bolder", fontSize: "20px" }}>
                    Total Orders delivered
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </div>

      <div className="mb-4">
        <h5>Orders delivered per day</h5>
        {purchaseDayData ? (
          <Bar
            data={purchaseDayData}
            options={chartOptions}
            style={{ maxHeight: "40vh" }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div>
        <h4 style={{ color: "#913b3bfc" }}>Orders delivered</h4>
        {loadingOrders ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : orders?.length > 0 ? (
          <>
            {orders?.map((order, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <h6>
                    Delivered Date:{" "}
                    {new Date(order.deliverdTime).toLocaleString("en-US", {
                      hour12: true,
                    })}
                  </h6>
                  <h6>
                    Picked Date:{" "}
                    {new Date(order.pickedTime).toLocaleString("en-US", {
                      hour12: true,
                    })}
                  </h6>

                  <p>Total: Rs.{order.total}</p>
                  <p>Customer Name : {order.customerName}</p>
                  <p>Customer Contact : {order.customerContact}</p>
                  <p>Customer Address : {order.customerAddress}</p>
                  <Row>
                    {order.products.map((productItem, idx) => (
                      <Col xs={12} md={6} lg={4} key={idx}>
                        <Card
                          className="mb-3"
                          style={{ transition: "transform 0.2s" }}
                        >
                          <Card.Body>
                            <h6>{productItem.name}</h6>
                            <p style={{ color: "text-secondary" }}>
                              Quantity: {productItem.quantity}
                            </p>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            ))}
          </>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </Container>
  );
}

export default DeliveryManInfo;
