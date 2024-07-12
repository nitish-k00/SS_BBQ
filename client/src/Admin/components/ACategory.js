import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  editCategorys,
  getCategory,
} from "../middleware/API";
import { Modal } from "antd";
import { Spinner, Container, Table, Form, Button } from "react-bootstrap";

function ACategory() {
  const [createCategoryValue, setCreateCategoryValue] = useState("");
  const [createCategoryError, setCreateCategoryError] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [editCategory, setEditCategory] = useState({ name: "" });
  const [editCategoryError, setEditCategoryError] = useState("");
  const [category, setCategory] = useState([]);
  const [deleteCate, setDeleteCate] = useState("");
  const [reRender, setReRender] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DeleteModalOpen, setDeleteModalOpen] = useState(false);

  const onClickCreateCategory = async () => {
    if (createCategoryValue === "") {
      setCreateCategoryError("Please fill the category");
      return;
    }
    setLoadingCreate(true);
    try {
      await createCategory(createCategoryValue);
      setCreateCategoryValue("");
      setCreateCategoryError("");
      setReRender(!reRender);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoadingCreate(false);
    }
  };

  const onClickEditCategory = async () => {
    if (editCategory.name === "") {
      setEditCategoryError("Please fill the category");
      return;
    }
    setLoadingEdit(true);
    try {
      await editCategorys(editCategory);
      setEditCategoryError("");
      setEditCategory({ name: "" });
      setReRender(!reRender);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error editing category:", error);
    } finally {
      setLoadingEdit(false);
    }
  };

  const onclickDelete = async () => {
    setLoadingDelete(true);
    try {
      await deleteCategory(deleteCate);
      setReRender(!reRender);
      setDeleteModalOpen(false);
      setDeleteCate("");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingList(true);
      try {
        const categoryData = await getCategory();
        setCategory(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingList(false);
      }
    };
    fetchCategories();
  }, [reRender]);

  useEffect(() => {
    const filterCategories = () => {
      const filteredCategory = category?.filter((data) =>
        data.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilterCategory(filteredCategory);
    };
    filterCategories();
  }, [searchValue, category]);

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Category</h2>
      <div className="d-flex mb-3 align-items-center flex-wrap">
        <Form.Control
          type="text"
          value={createCategoryValue}
          placeholder="Enter Category name"
          onChange={(e) => setCreateCategoryValue(e.target.value)}
          isInvalid={!!createCategoryError}
          className="me-3 mb-2 mb-sm-0"
          style={{ maxWidth: "300px" }}
        />

        <Button
          className="btn-primary"
          onClick={onClickCreateCategory}
          disabled={loadingCreate || loadingList}
          style={{ minWidth: "150px" }}
        >
          {loadingCreate ? (
            <Spinner animation="border" size="sm" />
          ) : (
            "Create Category"
          )}
        </Button>

        <Form.Control.Feedback type="invalid">
          {createCategoryError}
        </Form.Control.Feedback>
      </div>
      <Form.Control
        type="search"
        className="mb-3 form-control-sm"
        placeholder="Search Category"
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div className="table-responsive">
        <Table bordered hover responsive>
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan="2" className="text-center">
                  <Spinner animation="border" size="sm" />
                </td>
              </tr>
            ) : filterCategory.length > 0 ? (
              filterCategory.map((Category) => (
                <tr key={Category._id}>
                  <td className="ps-4 pt-3">{Category.name}</td>
                  <td className="ps-4">
                    <Button
                      className="btn-primary me-2 mb-1"
                      onClick={() => (
                        setEditCategory(Category), setIsModalOpen(true)
                      )}
                    >
                      Edit
                    </Button>
                    <Button
                      className="btn-danger mb-1"
                      onClick={() => (
                        setDeleteModalOpen(true), setDeleteCate(Category)
                      )}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center">
                  <p className="mt-2">NO CATEGORY FOUND</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <Modal
        title="Edit Category"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        style={{ maxWidth: "400px" }}
      >
        <div className="my-4">
          <Form.Control
            type="text"
            onChange={(e) =>
              setEditCategory({
                ...editCategory,
                [e.target.name]: e.target.value,
              })
            }
            name="name"
            value={editCategory.name}
            isInvalid={!!editCategoryError}
          />
          <Form.Control.Feedback type="invalid">
            {editCategoryError}
          </Form.Control.Feedback>
          <Button
            className="btn-primary mt-2 ms-3"
            onClick={onClickEditCategory}
            disabled={loadingEdit}
          >
            {loadingEdit ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Category"
            )}
          </Button>
        </div>
      </Modal>
      <Modal
        title="Disclaimer"
        open={DeleteModalOpen}
        onCancel={() => setDeleteModalOpen(false)}
        footer={null}
        style={{ maxWidth: "400px" }}
      >
        <div style={{ padding: "20px" }}>
          <h2 style={{ marginBottom: "10px" }}>Warning</h2>
          <h4 style={{ marginBottom: "10px" }}>-- {deleteCate.name} --</h4>
          <p>
            If you delete the Category, the Products under the category will be
            deleted.
          </p>
          <p>Are you sure about that?</p>
          <div className="d-flex justify-content-between mt-4">
            <Button
              className="btn-danger"
              onClick={onclickDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? <Spinner animation="border" size="sm" /> : "YES"}
            </Button>
            <Button
              className="btn-secondary"
              onClick={() => setDeleteModalOpen(false)}
            >
              CANCEL
            </Button>
          </div>
        </div>
      </Modal>
    </Container>
  );
}

export default ACategory;
