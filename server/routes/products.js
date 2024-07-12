const express = require("express");
const {
  allProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
  CategoryProduct,
  specialProduct,
  ProductNameQuantity,
} = require("../controller/product");
const { tokenCheck } = require("../midlleware/tokenCheack");
const { cheackIsAdmin } = require("../midlleware/adminCheack");
const route = express.Router();

route.get("/allProduct", allProduct);
route.get("/singleProduct/:id", singleProduct);
route.get("/cateProduct/:name", CategoryProduct);
route.get("/specialProduct", specialProduct);
route.post("/createProduct", tokenCheck, cheackIsAdmin, createProduct);
route.put("/updateProduct/:id", tokenCheck, cheackIsAdmin, updateProduct);
route.delete("/deleteProduct/:id", tokenCheck, cheackIsAdmin, deleteProduct);
route.get("/ProductNameQuantity", tokenCheck, ProductNameQuantity);

module.exports = route;
