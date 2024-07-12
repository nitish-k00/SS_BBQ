const categoryModel = require("../model/categoary");
const productModel = require("../model/product");
const cartModel = require("../model/cart");

const allCategory = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ _id: -1 });
    return res.status(200).json({ message: "all category", categories });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await categoryModel.findOne({ name });
    if (category) {
      return res.status(200).json({ message: "category already exists" });
    }
    const newCategory = new categoryModel({ name });
    await newCategory.save();
    return res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const categoary = await categoryModel.findById(id);
    if (!categoary) {
      return res.status(200).json({ message: "category not exist" });
    }
    await categoryModel.findByIdAndUpdate(id, { name }, { new: true });
    return res.status(200).json({
      message: "Category updated successfully",
    });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const productsToDelete = await productModel.find({ category: id });

    const cartsWithDeletedProducts = await cartModel.find({
      "products._id": { $in: productsToDelete.map((product) => product._id) },
    });

    await Promise.all(
      cartsWithDeletedProducts.map(async (cart) => {
        cart.products = cart.products.filter(
          (product) =>
            !productsToDelete.some(
              (p) => p._id.toString() === product._id.toString()
            )
        );

        cart.total = cart.products.reduce((total, product) => {
          if (product.discountPrice !== undefined) {
            return total + product.discountPrice * product.quantity;
          } else {
            return total;
          }
        }, 0);

        await cart.save();
        console.log("Cart after update:", cart);
      })
    );

    await productModel.deleteMany({ category: id });

    await categoryModel.findByIdAndDelete(id);

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  allCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
