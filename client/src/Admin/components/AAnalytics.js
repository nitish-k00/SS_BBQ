import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Bar } from "react-chartjs-2";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";
import handle401Error from "../../middleware/logoutExp";

const AAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("week");
  const [date, setDate] = useState(moment());
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);

  const backEndUrl = "http://localhost:8000";

  useEffect(() => {
    fetchOrders();
  }, [filter, date]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `${backEndUrl}/auth/allOrdersByDate?filter=${filter}&date=${formattedDate}`
      );
      const { totalAmount, totalOrders, userData } = response.data.orders;
      setOrders(userData);
      setTotalAmount(totalAmount);
      setTotalOrders(totalOrders);
      setUserData(userData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      await handle401Error(error);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const getWeekOfMonth = (date) => {
    return Math.ceil(date.date() / 7);
  };

  const groupByDate = (data, dateFormat) => {
    return data.reduce((acc, current) => {
      let dateKey;
      if (dateFormat === "week") {
        dateKey = moment(current.createdAt)
          .startOf("isoWeek")
          .format("YYYY-MM-DD");
      } else if (dateFormat === "month") {
        dateKey = `Week ${getWeekOfMonth(current.createdAt)}`;
      } else if (dateFormat === "year") {
        dateKey = moment(current.createdAt).format("MMMM");
      } else {
        dateKey = moment(current.createdAt).format(dateFormat);
      }

      if (!acc[dateKey]) {
        acc[dateKey] = { total: 0, count: 0, users: new Set(), times: {} };
      }
      acc[dateKey].total += current.total;
      acc[dateKey].count += 1;
      acc[dateKey].users.add(current.userName);

      const timeKey = moment(current.createdAt).format("h A");
      if (!acc[dateKey].times[timeKey]) {
        acc[dateKey].times[timeKey] = 0;
      }
      acc[dateKey].times[timeKey] += 1;

      return acc;
    }, {});
  };

  const getChartData = (groupedData) => {
    const labels = Object.keys(groupedData).map((key) => {
      const date = moment(key).format("DD-MM");
      const day = moment(key).format("dddd");
      const month = moment(key).format("MMMM");
      const week = getWeekOfMonth(moment(key));
      if (filter === "week") {
        return `${date}\n${day.slice(0, 3)}`;
      } else if (filter === "month") {
        return `${date} ( Week ${week} )`;
      } else if (filter === "year") {
        return `${month}`;
      } else {
        return key;
      }
    });

    const totalAmounts = Object.keys(groupedData).map(
      (key) => groupedData[key].total
    );
    const orderCounts = Object.keys(groupedData).map(
      (key) => groupedData[key].count
    );
    const userCounts = Object.keys(groupedData).map(
      (key) => groupedData[key].users.size
    );
    const mostOrderedTimes = Object.keys(groupedData).map((key) => {
      const times = groupedData[key].times;
      const mostOrderedTime = Object.keys(times).reduce((a, b) =>
        times[a] > times[b] ? a : b
      );
      return {
        time: mostOrderedTime,
        orders: times[mostOrderedTime],
      };
    });

    return {
      labels,
      totalAmounts,
      orderCounts,
      userCounts,
      mostOrderedTimes,
    };
  };

  const getTopProducts = (data) => {
    const productCounts = data.reduce((acc, order) => {
      order.products.forEach((product) => {
        if (!acc[product.name]) {
          acc[product.name] = 0;
        }
        acc[product.name] += product.quantity;
      });
      return acc;
    }, {});

    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Get top 5 products by quantity sold

    const labels = sortedProducts.map(([product]) => product);
    const counts = sortedProducts.map(([, count]) => count);

    return { labels, counts };
  };

  const dateFormats = {
    day: "YYYY-MM-DD",
    week: "YYYY-MM-DD",
    month: "week",
    year: "YYYY-MM",
  };

  const groupedData = groupByDate(userData, dateFormats[filter]);
  const chartData = getChartData(groupedData);
  const topProductsData = getTopProducts(userData);

  const filterOptions = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container>
      <h4 className="mt-4">Order Analytics</h4>

      <div className="mb-4">
        <Row className="align-items-center">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Filter</Form.Label>
              <Form.Control
                as="select"
                value={filter}
                onChange={handleFilterChange}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={moment(date).format("YYYY-MM-DD")}
                onChange={(e) => setDate(moment(e.target.value))}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>
      {orders?.length > 0 ? (
        <>
          <div className="mb-4">
            <h5>Orders Summary</h5>
            <Row>
              <Col xs={12} sm={6}>
                <div className="p-2 bg-primary text-white rounded text-center">
                  <h6>Total Amount</h6>
                  <h4>{totalAmount}</h4>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <div className="p-2 bg-secondary text-white rounded text-center">
                  <h6>Total Orders</h6>
                  <h4>{totalOrders}</h4>
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xs={12} md={6}>
              <div className="mb-4">
                <h5>Total Amount by {filter}</h5>
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Total Amount",
                        data: chartData.totalAmounts,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="mb-4">
                <h5>Number of Orders by {filter}</h5>
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Number of Orders",
                        data: chartData.orderCounts,
                        backgroundColor: "rgba(255, 159, 64, 0.2)",
                        borderColor: "rgba(255, 159, 64, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6}>
              <div className="mb-4">
                <h5>Number of Users by {filter}</h5>
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Number of Users",
                        data: chartData.userCounts,
                        backgroundColor: "rgba(153, 102, 255, 0.2)",
                        borderColor: "rgba(153, 102, 255, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="mb-4">
                <h5>Most Ordered Times by {filter}</h5>
                <Bar
                  data={{
                    labels: chartData.labels,
                    datasets: [
                      {
                        label: "Most Ordered Time",
                        data: chartData.mostOrderedTimes.map(
                          (item) => item.orders
                        ),
                        backgroundColor: "rgba(255, 99, 132, 0.2)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Col>
          </Row>
          <div className="mb-4">
            <h5>Top Products</h5>
            <Bar
              data={{
                labels: topProductsData.labels,
                datasets: [
                  {
                    label: "Quantity Sold",
                    data: topProductsData.counts,
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </>
      ) : (
        <p>No orders found for the selected period.</p>
      )}
    </Container>
  );
};

export default AAnalytics;
