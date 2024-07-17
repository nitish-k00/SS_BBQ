const cartModel = require("../model/cart");
const favouriteModel = require("../model/favourite");
const productModel = require("../model/product");
const redisClient = require("../redisClient");

// Create a product and cache the result
const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    discount,
    quantity,
    photo,
    available,
    special,
    category,
  } = req.body;

  try {
    const existingProduct = await productModel.findOne({ name });
    if (existingProduct) {
      return res.status(400).json({ message: "product already exists" });
    }

    const discountPrice = (price - (price * discount) / 100).toFixed(2);

    const newProduct = new productModel({
      name,
      description,
      price,
      discount,
      discountPrice,
      quantity,
      photo,
      available,
      special,
      category,
    });
    await newProduct.save();

    const products = await productModel
      .find()
      .populate("category")
      .sort({ _id: -1 });

    // Cache the products
    await redisClient.setEx("products", 3600, JSON.stringify(products));

    return res
      .status(200)
      .json({ message: "product added successfully", product: products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// Update a product and update the cache
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    description,
    price,
    discount,
    quantity,
    photo,
    available,
    category,
    special,
  } = req.body;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }
    const oldPrice = product.price; // Store the old price for comparison later
    const oldDiscount = product.discount;

    // Update the product with the new data
    product.description = description;
    product.price = price;
    product.discount = discount;
    product.quantity = quantity;
    product.photo = photo;
    product.available = available;
    product.special = special;
    product.category = category;

    const discountPrice = (price - (price * discount) / 100).toFixed(2);
    product.discountPrice = discountPrice;

    await product.save();

    if (oldPrice !== price || oldDiscount !== discount) {
      const carts = await cartModel
        .find({ "products._id": id })
        .populate({ path: "products._id", select: "discountPrice" });
      await Promise.all(
        carts.map(async (cart) => {
          cart.total = cart.products.reduce((total, data) => {
            return total + data._id.discountPrice * data.quantity;
          }, 0);
          await cart.save(); // Save the updated cart
        })
      );
    }

    const products = await productModel
      .find()
      .populate("category")
      .sort({ _id: -1 });

    // Update the cache
    await redisClient.setEx("products", 3600, JSON.stringify(products));

    const allFavourites = await favouriteModel.find().populate("products");

    // Update Redis with all favorites
    await Promise.all(
      allFavourites.map(async (favProduct) => {
        const cacheKeyFav = `fav${favProduct.userId}`;
        await redisClient.setEx(
          cacheKeyFav,
          3600,
          JSON.stringify(favProduct.products)
        );
      })
    );

    return res
      .status(200)
      .json({ message: "product updated successfully", product: products });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "internal server error" });
  }
};

// Delete a product and update the cache
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cartsWithDeletedProduct = await cartModel.find({
      "products._id": id,
    });

    await Promise.all(
      cartsWithDeletedProduct.map(async (cart) => {
        cart.products = cart.products.filter(
          (cartProduct) => cartProduct._id.toString() !== id
        );
        cart.total = cart.products.reduce((total, product) => {
          if (product.discountPrice !== undefined) {
            return total + product.discountPrice * product.quantity;
          } else {
            return total;
          }
        }, 0);
        await cart.save(); // Save the updated cart
      })
    );

    await productModel.findByIdAndDelete(id);

    const products = await productModel
      .find()
      .populate("category")
      .sort({ _id: -1 });

    // Update the cache
    await redisClient.setEx("products", 3600, JSON.stringify(products));

    const allFavourites = await favouriteModel.find().populate("products");
    await Promise.all(
      allFavourites.map(async (favProduct) => {
        const cacheKeyFav = `fav${favProduct.userId}`;
        await redisClient.setEx(
          cacheKeyFav,
          3600,
          JSON.stringify(favProduct.products)
        );
      })
    );
    return res
      .status(200)
      .json({ message: "Product deleted successfully", product: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve all products and cache the result
const allProduct = async (req, res) => {
  try {
    const data = await redisClient.get("products");
    console.log("redis");

    if (data !== null) {
      return res.status(200).json({
        message: "product recived successfully",
        product: JSON.parse(data),
      });
    } else {
      const products = await productModel
        .find()
        .populate("category")
        .sort({ _id: -1 });

      console.log("db");

      // Cache the products
      await redisClient.setEx("products", 3600, JSON.stringify(products));

      return res
        .status(200)
        .json({ message: "product recived successfully", product: products });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "internal server error" });
  }
};

// Retrieve a single product
const singleProduct = async (req, res) => {
  const { id } = req.params;
  const cacheSingleProduct = `singleProduct${id}`;

  try {
    const product = await productModel.findById(id).populate("category");

    const data = await redisClient.get(cacheSingleProduct);
    if (data !== null) {
      return res.status(200).json({
        message: "product recived successfully",
        product: JSON.parse(data),
      });
    }
    if (product) {
      await redisClient.setEx(
        cacheSingleProduct,
        3600,
        JSON.stringify(product)
      );
      return res
        .status(200)
        .json({ message: "product recived successfully", product });
    }
    return res.status(404).json({ message: " NO product available", product });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

// Retrieve products by category
const CategoryProduct = async (req, res) => {
  const { name } = req.params;

  try {
    // Find the category document to get its _id
    const category = await categoryModel.findOne({
      name: new RegExp("^" + name + "$", "i"),
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const products = await productModel
      .find({ category: category._id })
      .limit(4)
      .populate("category")
      .sort({ _id: -1 });

    console.log(products.length);

    if (products.length > 0) {
      return res.status(200).json({
        message: "Products received successfully",
        CategoryProduct: products,
      });
    } else {
      return res
        .status(404)
        .json({ message: "No products available for this category" });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Retrieve special products
const specialProduct = async (req, res) => {
  try {
    const product = await productModel
      .find({ special: true })
      .populate("category")
      .sort({ _id: -1 })
      .limit(4);

    return res
      .status(200)
      .json({ message: "product recived successfully", product });
  } catch (error) {
    return res.status(501).json({ message: "internal server error" });
  }
};

const ProductNameQuantity = async (req, res) => {
  try {
    const products = await productModel.find();

    const formattedProducts = products.map((data) => {
      return {
        name: data.name,
        quantity: data.quantity,
      };
    });

    return res.status(200).json({
      message: "product recived successfully",
      product: formattedProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({ message: "internal server error" });
  }
};

module.exports = {
  allProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  singleProduct,
  CategoryProduct,
  specialProduct,
  ProductNameQuantity,
};
