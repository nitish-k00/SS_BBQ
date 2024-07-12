import React, { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import ProductForm from "../middleware/ProductForm";
import { Modal } from "antd";

import ProductTable from "../middleware/ProductTable";

const formFormat = {
  name: "",
  description: "",
  price: "",
  discount: "",
  quantity: "",
  available: false,
  special: false,
  category: "",
  photo: [],
};

function AProduct() {
  const [ismodelopen, setIsModelOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState(formFormat);
  const [products, setProduct] = useState([]);

  const changeIsModel = () => {
    setIsModelOpen(true);
  };

  return (
    <div className="mt-3">
      <Container>
        <h2>PRODUCTS :</h2>
        <Button className="my-3" onClick={() => changeIsModel()}>
          create product
        </Button>
        <ProductTable products={products} setProduct={setProduct} />
        <Modal
          title="Create Product"
          footer={null}
          open={ismodelopen}
          onCancel={() => (
            setIsModelOpen(false), setFormData(formFormat), setFormError("")
          )}
        >
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            formError={formError}
            setFormError={setFormError}
            setIsModelOpen={setIsModelOpen}
            products={products}
            setProduct={setProduct}
          />
        </Modal>
      </Container>
    </div>
  );
}

export default AProduct;
