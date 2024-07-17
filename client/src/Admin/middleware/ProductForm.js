import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  FormControl,
  FormCheck,
  FormGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { createProduct, editProduct, getCategory } from "./API";
import { Spinner } from "react-bootstrap";

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

function ProductForm({
  formData,
  setFormData,
  formError,
  setFormError,
  setIsModelOpen,
  setProduct,
}) {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [id]: newValue,
    });
    setFormError("");
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const base64 = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const fileSize = Math.round(file.size / 1024); // Size in KB

        if (formData.photo.length < 3) {
          if (fileSize > 1000) {
            // Check if file size exceeds 1MB (1000KB)
            setFormError({
              ...formError,
              photo: "One or more images exceed 1MB size limit",
            });
          } else {
            base64.push(reader.result);

            if (base64.length === files.length) {
              if (formData.photo.length + files.length <= 3) {
                setFormData({
                  ...formData,
                  photo: [...formData.photo, ...base64],
                });
                setFormError("");
              } else {
                toast.error("You can only select up to 3 images.");
              }
            }
          }
        } else {
          setFormError({
            ...formError,
            photo: "max photo limit reached",
          });
        }
      };
    });
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...formData.photo];
    updatedFiles.splice(index, 1);
    setFormData({
      ...formData,
      photo: updatedFiles,
    });
  };

  const formCheck = () => {
    const { name, description, price, discount, quantity, category, photo } =
      formData;

    const errors = {};
    if (!name.trim()) errors.name = "Please enter product name";
    if (!description.trim())
      errors.description = "Please enter product description";
    if (!price) errors.price = "Please enter product price";
    else if (isNaN(price)) errors.price = "Please enter a valid number";
    if (!discount) errors.discount = "Please enter product discount";
    else if (isNaN(discount)) errors.discount = "Please enter a valid number";
    else if (discount > 100)
      errors.discount = "Discount should be less than 100";
    if (!quantity) errors.quantity = "Please enter product quantity";
    else if (isNaN(quantity)) errors.quantity = "Please enter a valid number";
    if (!category) errors.category = "Please enter product category";
    if (!photo.length) errors.photo = "Please upload product photo";
    setFormError(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchEditProductData = async () => {
    const productData = await editProduct(formData);
    setProduct(Array.isArray(productData) ? productData : []);
    setFormData(formFormat);
    setIsModelOpen(false);
  };

  const fetchCreateProductData = async () => {
    const productData = await createProduct(formData);
    setProduct(Array.isArray(productData) ? productData : []);
    setFormData(formFormat);
    setIsModelOpen(false);
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!formCheck()) return;
    setLoading(true);
    try {
      formData._id
        ? await fetchEditProductData()
        : await fetchCreateProductData();
    } catch (error) {
      // //console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const cate = await getCategory();
      setCategory(cate);
    };
    fetchCategory();
  }, []);

  const categoryName = category.find((data) => data._id === formData.category);
  const cate = categoryName ? categoryName.name : null;

  return (
    <Form
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      {!formData._id ? (
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            isInvalid={!!formError.name}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {formError.name}
          </Form.Control.Feedback>
        </Form.Group>
      ) : (
        ""
      )}

      <Form.Group controlId="description">
        <Form.Label>Description </Form.Label>
        <Form.Control
          as="textarea"
          placeholder="Enter product description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          isInvalid={!!formError.description}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {formError.description}
        </Form.Control.Feedback>
      </Form.Group>

      <div style={{ display: "flex" }}>
        <Form.Group controlId="price" className="me-2">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product price"
            value={formData.price}
            onChange={handleInputChange}
            isInvalid={!!formError.price}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {formError.price}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="discount">
          <Form.Label>Discount</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product discount"
            value={formData.discount}
            onChange={handleInputChange}
            isInvalid={!!formError.discount}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {formError.discount}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <div style={{ display: "flex" }}>
        <Form.Group controlId="quantity" className="me-2">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            isInvalid={!!formError.quantity}
            disabled={loading}
          />
          <Form.Control.Feedback type="invalid">
            {formError.quantity}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Select
            value={cate}
            onChange={(event) => {
              const id = category.find(
                (category) => category.name === event.target.value
              );

              setFormData({
                ...formData,
                category: id ? id._id : "",
              });
              setFormError("");
            }}
            isInvalid={!!formError.category}
            disabled={loading}
          >
            <option value="">Select category</option>
            {category.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {formError.category}
          </Form.Control.Feedback>
        </Form.Group>
      </div>

      <Form.Group>
        <Form.Label>Choose product photo (up to 3 images)</Form.Label>
        <Form.Control
          type="file"
          multiple
          onChange={handleFileChange}
          isInvalid={!!formError.photo}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">
          {formError.photo}
        </Form.Control.Feedback>
      </Form.Group>

      <div>
        {formData.photo.map((file, index) => (
          <div key={index} className="mt-3">
            <img
              src={file}
              alt="Preview"
              style={{
                marginTop: "10px",
                maxWidth: "100px",
              }}
            />
            <Button
              variant="danger"
              size="sm"
              className="ms-2"
              onClick={() => handleRemoveFile(index)}
              disabled={loading}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Form.Group controlId="available" className="mt-3">
        <Form.Check
          type="checkbox"
          label="Check if product is available"
          checked={formData.available}
          onChange={handleInputChange}
          disabled={loading}
        />
      </Form.Group>

      <Form.Group controlId="special">
        <Form.Check
          type="checkbox"
          label="Special of the day"
          checked={formData.special}
          onChange={handleInputChange}
          disabled={loading}
        />
      </Form.Group>

      <Button
        variant="primary"
        onClick={onSubmitForm}
        disabled={loading}
        className="mt-3"
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Submit"}
      </Button>
    </Form>
  );
}

export default ProductForm;
