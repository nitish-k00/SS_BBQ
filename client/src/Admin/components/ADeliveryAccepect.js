import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Spinner,
  Form,
  Tooltip,
  OverlayTrigger,
  Alert,
  CloseButton,
} from "react-bootstrap";
import {
  GetDeliveryRegisteredUsers,
  deliveryManRegisterAccept,
} from "../middleware/API";

const ADeliveryAccepect = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [deliveryId, setDeliveryId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await GetDeliveryRegisteredUsers();
        // //console.log(response);
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm)
    );
    setFilteredData(results);
  }, [searchTerm, data]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleAcceptClick = (deliveryId) => {
    setShowAlert(true);
    setAlertMessage(
      "Are you sure? Have you verified the user's driving license and Info ?"
    );
    setDeliveryId(deliveryId);
  };

  const handleAlertConfirm = async () => {
    setShowAlert(false);
    setAlertMessage("");
    if (deliveryId === null) {
      return;
    }
    setConfirmLoading(true);
    try {
      const response = await deliveryManRegisterAccept(deliveryId);
      setData(response);
      setFilteredData(response);
      setSnackbarMessage("Delivery accepted successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error accepting delivery:", error);
    }
    setConfirmLoading(false);
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    setAlertMessage("");
    setDeliveryId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <Container className="my-5">
      <h1 style={{ marginBottom: "1rem" }}>Delivery Man Registered</h1>
      <Form.Control
        type="text"
        placeholder="Search by name or phone number"
        value={searchTerm}
        onChange={handleSearchChange}
        className="my-3"
      />
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Spinner animation="border" />
        </div>
      ) : (
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Driving License</th>
              <th>Actions</th>
            </tr>
          </thead>
          {filteredData.length !== 0 ? (
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>
                    <img
                      src={item.driveingLisense}
                      alt="Driving License"
                      style={{ width: "100px", cursor: "pointer" }}
                      onClick={() => handleImageClick(item.driveingLisense)}
                    />
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip id={`tooltip-${item.id}`}>
                          Accept Delivery
                        </Tooltip>
                      }
                    >
                      <Button
                        variant="primary"
                        onClick={() => handleAcceptClick(item.id)}
                      >
                        Accept
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  NO REGISTERED INFO FOUND
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      )}

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        style={{
          marginTop: "70px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Driving License</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img
            src={selectedImage}
            alt="Driving License"
            style={{ width: "100%" }}
          />
        </Modal.Body>
      </Modal>

      {/* Alert Modal */}
      <Modal
        show={showAlert}
        onHide={handleAlertCancel}
        style={{
          marginTop: "200px",
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alertMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary bg-danger" onClick={handleAlertCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAlertConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? (
              <Spinner as="span" animation="border" size="sm" />
            ) : (
              "Accept"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Snackbar */}
      <Alert
        show={snackbarOpen}
        variant="success"
        dismissible
        onClose={handleSnackbarClose}
      >
        {snackbarMessage}
        <CloseButton
          variant="white"
          onClick={handleSnackbarClose}
          size="sm"
          className="float-right"
        />
      </Alert>
    </Container>
  );
};

export default ADeliveryAccepect;
