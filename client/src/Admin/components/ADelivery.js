import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DeliveryManBlockUnBlock, deliveryManInfo } from "../middleware/API";

function ADelivery() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [id, setId] = useState(null);

  // //console.log(users);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await deliveryManInfo();
      setUsers(response);
      setFilteredUsers(response); // Set filteredUsers initially to the fetched users
      // //console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const onClickDeliveryManBlockUnBlock = async (id) => {
    setBlockLoading(true);
    setId(id);
    if (id === null) return;
    try {
      const response = await DeliveryManBlockUnBlock(id);
      setUsers(response);
      setFilteredUsers(response);
      setId(null);
      // //console.log(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setBlockLoading(false);
  };

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.contact.includes(searchTerm)
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewUser = (userId) => {
    navigate(`/deliveryInfo/${userId}`);
  };

  return (
    <Container className="py-4">
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div>
          <h4 className="mb-3">All Delivery Man</h4>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search by name or phone number"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.deliveryManId}>
                    <td>{user.deliveryManId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.contact}</td>
                    <td>{user.status}</td>
                    <td>
                      <Button
                        variant="primary"
                        className="me-2 mb-2"
                        onClick={() => handleViewUser(user.deliveryManId)}
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        className="me-2 mb-2"
                        disabled={blockLoading}
                        style={{
                          backgroundColor: user.blocked ? "green" : "red",
                        }}
                        onClick={() =>
                          onClickDeliveryManBlockUnBlock(user.deliveryManId)
                        }
                      >
                        {user.blocked ? "UnBlock" : "Block"}{" "}
                        {blockLoading && id === user.deliveryManId && (
                          <Spinner
                            className="ms-2"
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center">
                    NO DELIVERY MAN DATA FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
}

export default ADelivery;
