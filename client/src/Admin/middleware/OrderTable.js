import React, { useState, useEffect } from "react";
import {
  Table,
  Pagination,
  FormControl,
  InputGroup,
  Button,
  Form,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Example icons from Font Awesome
import { allOrdersDate } from "./API";

const OrderTable = ({
  orders,
  setOrders,
  totalPages,
  currentPage,
  setCurrentPage,
  handleEdit,
  handleDelete,
  fetchOrders,
  dashboard,
}) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("completed");
  const [orderDateFilter, setOrderDateFilter] = useState(null);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("orderDate");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    filterOrders();
  }, [
    orders,
    paymentStatusFilter,
    orderDateFilter,
    order,
    orderBy,
    searchTerm,
  ]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filterOrders = () => {
    let filtered = orders;

    if (!filtered?.length) {
      setFilteredOrders([]);
      return;
    }

    if (paymentStatusFilter) {
      filtered = filtered?.filter(
        (order) => order.paymentStatus === paymentStatusFilter
      );
    }

    if (orderDateFilter) {
      filtered = filtered?.filter(
        (order) =>
          new Date(order.orderDate).toLocaleDateString() ===
          new Date(orderDateFilter).toLocaleDateString()
      );
    }

    if (searchTerm) {
      filtered = filtered?.filter((order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sortedData = filtered?.sort((a, b) => {
      if (orderBy === "total") {
        return order === "asc" ? a.total - b.total : b.total - a.total;
      }
      if (orderBy === "orderDate") {
        return order === "asc"
          ? new Date(a.orderDate) - new Date(b.orderDate)
          : new Date(b.orderDate) - new Date(a.orderDate);
      }
      if (a[orderBy] < b[orderBy]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[orderBy] > b[orderBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredOrders(sortedData);
  };

  const fetchOrdersDate = async () => {
    try {
      const response = await allOrdersDate(orderDateFilter);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (orderDateFilter !== null) {
      fetchOrdersDate();
    }
    if (orderDateFilter === null && fetchOrders) {
      fetchOrders();
    }
  }, [orderDateFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "created":
        return "#808080"; // Gray
      case "confirmed":
        return "#0000FF"; // Blue
      case "prepared":
        return "#FFA500"; // Orange
      case "picked":
        return "#800080"; // Purple
      case "delivered":
        return "#008000"; // Green
      default:
        return "#FFFFFF"; // White for unknown statuses
    }
  };

  return (
    <Container className="p-4">
      <Row className="mb-3">
        <Col md={4} className="mb-2 mb-md-0">
          <Form.Select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </Form.Select>
        </Col>
        <Col md={4} className="mb-2 mb-md-0">
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search by Customer Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        {dashboard ? (
          ""
        ) : (
          <Col md={4}>
            <InputGroup>
              <Form.Control
                type="date"
                value={orderDateFilter}
                onChange={(e) => setOrderDateFilter(e.target.value)}
              />
            </InputGroup>
          </Col>
        )}
      </Row>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Payment Method</th>
            <th>Delivery Status</th>
            <th>Payment Status</th>
            <th>Order Date</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders && filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order._id}>
                <td>
                  {currentPage ? (currentPage - 1) * 10 + index + 1 : index + 1}
                </td>
                <td>{order?.orderId}</td>
                <td>{order?.customerName}</td>
                <td>{order?.paymentMethod}</td>
                <td>
                  <span
                    style={{
                      backgroundColor: getStatusColor(order?.deliveryStatus),
                      padding: "3px 5px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {order?.deliveryStatus}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      color: "white",
                      backgroundColor:
                        order.paymentStatus === "completed" ? "green" : "red",
                      padding: "3px 5px",
                    }}
                  >
                    {order.paymentStatus}
                  </span>
                </td>
                <td>
                  {new Date(order.orderDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}

                  <p>
                    {new Date(order.orderDate).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </p>
                </td>
                <td>Rs.{order.total}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => handleEdit(order.orderId)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mb-2"
                    onClick={() => handleDelete(order.orderId)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>NO ORDER DATA FOUND</td>
            </tr>
          )}
        </tbody>
      </Table>
      {currentPage && !orderDateFilter && (
        <Pagination className="justify-content-center mt-3">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </Container>
  );
};

export default OrderTable;
