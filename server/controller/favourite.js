const favouriteModel = require("../model/favourite");
const redisClient = require("../redisClient");
const mongoose = require("mongoose");

const addAndRemoveFav = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const cacheKeyFav = `fav${userId}`;
  const cacheKeyFavCol = `favCol${userId}`;

  try {
    const existingUserFav = await favouriteModel
      .findOne({ userId })
      .populate("products");

    if (existingUserFav) {
      const productIndex = existingUserFav.products.findIndex(
        (data) => data._id.toString() === productId.toString()
      );

      if (productIndex !== -1) {
        existingUserFav.products.splice(productIndex, 1);
        await existingUserFav.save();
        await redisClient.setEx(
          cacheKeyFav,
          3600,
          JSON.stringify(existingUserFav.products)
        );

        const productIDS = existingUserFav.products.map((data) => data._id);
        await redisClient.setEx(
          cacheKeyFavCol,
          3600,
          JSON.stringify(productIDS)
        );
        return res.status(200).json({
          message: "Product removed from favorites",
          favProduct: existingUserFav.products,
        });
      } else {
        existingUserFav.products.push(new mongoose.Types.ObjectId(productId));
        await existingUserFav.save();
        await existingUserFav.populate("products");
        // console.log(fullData.products);
        await redisClient.setEx(
          cacheKeyFav,
          3600,
          JSON.stringify(existingUserFav.products)
        );
        const productIDS = existingUserFav.products.map((data) => data._id);
        await redisClient.setEx(
          cacheKeyFavCol,
          3600,
          JSON.stringify(productIDS)
        );
        return res.status(200).json({
          message: "Product added to favorites",
        });
      }
    } else {
      const newUserFav = new favouriteModel({
        userId,
        products: [productId],
      });
      await newUserFav.save();
      await redisClient.setEx(
        cacheKeyFav,
        3600,
        JSON.stringify(newUserFav.products)
      );
      await redisClient.setEx(cacheKeyFavCol, 3600, productId);
      return res.status(201).json({
        message: "Product added to favorites",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getFav = async (req, res) => {
  const userId = req.user._id;
  const cacheKeyFav = `fav${userId}`;
  try {
    const data = await redisClient.get(cacheKeyFav);

    if (data !== null) {
      return res
        .status(200)
        .json({ message: "Products resived", favProduct: JSON.parse(data) });
    }

    const favProduct = await favouriteModel
      .findOne({ userId })
      .populate("products");

    if (!favProduct || !favProduct.products) {
      return res.status(404).json({ message: "Favourite products not found" });
    }

    await redisClient.setEx(
      cacheKeyFav,
      3600,
      JSON.stringify(favProduct.products)
    );

    return res
      .status(200)
      .json({ message: "Products resived", favProduct: favProduct.products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};

const favColour = async (req, res) => {
  const userId = req.user._id;
  const cacheKeyFavCol = `favCol${userId}`;
  try {
    const data = await redisClient.get(cacheKeyFavCol);
    if (data !== null) {
      return res
        .status(200)
        .json({ message: "Products resived", favProduct: JSON.parse(data) });
    }
    const favProduct = await favouriteModel.findOne({ userId });

    if (
      favProduct === null ||
      favProduct.products === undefined ||
      !favProduct ||
      !favProduct.products
    ) {
      return res.status(404).json({ message: "Favourite products not found" });
    }

    await redisClient.setEx(
      cacheKeyFavCol,
      3600,
      JSON.stringify(favProduct.products)
    );
    return res
      .status(200)
      .json({ message: "Products resived", favProduct: favProduct?.products });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
};
module.exports = { addAndRemoveFav, getFav, favColour };
