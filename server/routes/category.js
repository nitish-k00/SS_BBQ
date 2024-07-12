const express = require("express");
const {
  allCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category");

const { cheackIsAdmin } = require("../midlleware/adminCheack");
const { tokenCheck } = require("../midlleware/tokenCheack");
const route = express.Router();

route.get("/allCategory", allCategory);
route.post("/createCategory", tokenCheck, cheackIsAdmin, createCategory);
route.put("/updateCategory/:id", tokenCheck, cheackIsAdmin, updateCategory);
route.delete("/deleteCategory/:id", tokenCheck, cheackIsAdmin, deleteCategory);

module.exports = route;
