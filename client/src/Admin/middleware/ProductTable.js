import React, { useEffect, useState } from "react";
import { deleteProduct, getProduct } from "../middleware/API";
import { Button, Modal, Spinner } from "react-bootstrap";
import ProductForm from "./ProductForm";

const formFormat = {
  name: "",
  description: "",
  price: "",
  discount: "",
  quantity: "",
  available: false,
  category: "",
  photo: [],
};

function ProductTable({ products, setProduct }) {
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState(formFormat);
  const [ismodelopen, setIsModelOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [displayProduct, setDisplayProduct] = useState([]);
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletes, setDeletes] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    const filter = () => {
      const productData = products?.filter((data) =>
        data?.name?.toLowerCase().includes(searchValue.toLowerCase())
      );
      setDisplayProduct(productData);
    };
    filter();
  }, [products, searchValue]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProduct();
        setProduct(Array.isArray(productData) ? productData : []);
      } catch (error) {
        // //console.log(error);
        setProduct([]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, []);

  const fetchDelete = async (id) => {
    setLoadingDelete(true);
    const productData = await deleteProduct(id);
    setProduct(Array.isArray(productData) ? productData : []);
    setLoadingDelete(false);

    setDeleteModalOpen(false);
    setDeletes("");
  };

  const productList = (product) => {
    setEditForm({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      discount: product.discount,
      quantity: product.quantity,
      available: product.available,
      special: product.special,
      category: product.category._id,
      photo: product.photo,
    });
    setIsModelOpen(true);
    // //console.log(product);
  };

  // //console.log(products);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <div className="my-4">
        <input
          type="search"
          className="form-control"
          placeholder="Search Category"
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Discount Price</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Special</th>
            <th>Category</th>
            <th>Photos</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayProduct.length > 0 ? (
            displayProduct?.map((product) => (
              <tr key={product._id}>
                <td>{product?.name}</td>
                <td>{product?.description}</td>
                <td>{product?.price}</td>
                <td>{product?.discount}</td>
                <td>{product?.discountPrice}</td>
                <td>{product?.quantity}</td>
                <td>{product?.available ? "Yes" : "No"}</td>
                <td>{product?.special ? "Yes" : "No"}</td>
                <td>{product?.category.name}</td>
                <td>
                  {product?.photo?.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      style={{
                        maxWidth: "50px",
                        maxHeight: "50px",
                        marginRight: "5px",
                      }}
                    />
                  ))}
                </td>
                <td>
                  <Button
                    className="mb-2 me-2"
                    onClick={() => productList(product)}
                  >
                    EDIT
                  </Button>
                  <Button
                    className="mb-2 bg-danger"
                    onClick={() => (
                      setDeletes(product), setDeleteModalOpen(true)
                    )}
                  >
                    DELETE
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">
                <p className="mt-3">NO PRODUCTS FOUND</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal
        show={ismodelopen}
        onHide={() => (
          setIsModelOpen(false), setEditForm(formFormat), setFormError("")
        )}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductForm
            formData={editForm}
            setFormData={setEditForm}
            formError={formError}
            setFormError={setFormError}
            setIsModelOpen={setIsModelOpen}
            setProduct={setProduct}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={DeleteModalOpen}
        onHide={() => (setDeleteModalOpen(false), setDeletes(""))}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Disclaimer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "10px", color: "red" }}>Warning</h2>
            <h4 style={{ marginBottom: "10px" }}>-- {deletes.name} --</h4>
            <p>The Products will be permanently deleted.</p>
            <p>Are you sure about that?</p>
            <div className="d-flex justify-content-between mt-4">
              <Button
                variant="danger"
                onClick={() => fetchDelete(deletes._id)}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "YES"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setDeleteModalOpen(false)}
              >
                CANCEL
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ProductTable;
