import React, { useEffect, useState } from "react";
import { deliverdOrder } from "../middleware/API";
import {
  Container,
  Table,
  Spinner,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

function DDelivered() {
  const [deliverdData, setDeliverdData] = useState([]);
  const [deliveryDataLoading, setDeliveryDataLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("customerName");
  const [searchTerm, setSearchTerm] = useState("");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handelDeliverdOrder = async () => {
    setDeliveryDataLoading(true);
    try {
      const response = await deliverdOrder();
      setDeliverdData(response);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    setDeliveryDataLoading(false);
  };

  useEffect(() => {
    handelDeliverdOrder();
  }, []);

  if (deliveryDataLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const sortedData = deliverdData?.sort((a, b) => {
    if (orderBy === "total") {
      return order === "asc" ? a.total - b.total : b.total - a.total;
    }
    if (a[orderBy] < b[orderBy]) {
      return order === "asc" ? -1 : 1;
    }
    if (a[orderBy] > b[orderBy]) {
      return order === "asc" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData?.filter((order) =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="mt-4">
      <div className="mb-3">
        <InputGroup>
          <FormControl
            placeholder="Search by Customer Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </div>
      <Table bordered hover>
        <thead>
          <tr>
            <th>Customer Name </th>
            <th>Delivered Time </th>
            <th>Products</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((order, index) => (
              <tr key={index}>
                <td>{order.customerName}</td>
                <td>
                  {new Date(order.deliverdTime).toLocaleString("en-US", {
                    hour12: true,
                  })}
                </td>
                <td>
                  {order.products.map((product, idx) => (
                    <div key={idx}>
                      {product.name} - {product.quantity}
                    </div>
                  ))}
                </td>
                <td>Rs.{order.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>
                NO DELIVERY DATA FOUND
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default DDelivered;
