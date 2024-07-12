const sendOtpViaSMS = require("../midlleware/contact");
const otpGenerator = require("otp-generator");
const deliveryModel = require("../model/delivery");
const OrderModel = require("../model/order");
const userModel = require("../model/userModel");
const socket = require("../index");
const DeliveryUser = require("../model/deliveryUser");

const deliveryDisplayBox = async (req, res) => {
  try {
    const preparedOrders = await OrderModel.find({
      "orderPicked.status": "prepared",
    });

    if (!preparedOrders || preparedOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found with prepared status",
      });
    }

    const formatedDelivery = preparedOrders.map((data) => {
      return { orderId: data.orderId, address: data.customer.address };
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders: formatedDelivery,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const orderPicked = async (req, res) => {
  const { orderId, geolocation } = req.body;
  console.log(geolocation);
  const deliveryManId = req.user._id;

  const deliveryMan = await DeliveryUser.findById(deliveryManId);

  try {
    if (!deliveryMan) {
      return res.status(404).json({
        message: "No delivery man found",
      });
    }

    if (deliveryMan.deliveryStatus === "pending") {
      return res.status(400).json({
        message:
          "You are already on a delivery. You cannot pick up another order.",
      });
    }

    const preparedOrder = await OrderModel.findOne({ orderId }).populate(
      "products.product"
    );

    if (!preparedOrder) {
      return res.status(404).json({
        message: "No orders found with the given orderId",
      });
    }

    const orderIdDeliveryId = `${orderId}-${deliveryManId}`;
    const existingDelivery = await deliveryModel.findOne({ orderIdDeliveryId });
    if (existingDelivery) {
      return res.status(409).json({
        message: "This order has already been picked by the delivery man",
      });
    }

    const formattedDelivery = {
      orderIdDeliveryId: orderIdDeliveryId,
      status: "picked",
      deliveryManId: deliveryManId,
      total: preparedOrder.total,
      pickedTime: new Date(),
      customer: {
        userId: preparedOrder.customer.userId,
        name: preparedOrder.customer.name,
        address: preparedOrder.customer.address,
        contact: preparedOrder.customer.contact,
        geolocation: preparedOrder.customer.geolocation,
      },
      products: preparedOrder.products,
    };

    const newDeliveryData = new deliveryModel(formattedDelivery);
    await newDeliveryData.save();

    preparedOrder.orderPicked = {
      name: deliveryMan.name,
      contact: deliveryMan.phone,
      date: new Date(),
      status: "picked",
      Geolocation: [geolocation[0], geolocation[1]],
    };
    preparedOrder.products.forEach((product) => {
      product.orderStatus = "picked";
    });

    await preparedOrder.save();

    deliveryMan.deliveryStatus = "pending";
    await deliveryMan.save();

    const phoneNumber =
      `+91${9080877144}` || `+91${preparedOrder.customer.contact}`;
    // console.log(phoneNumber);

    if (!phoneNumber) {
      return res.status(400).json({ message: "contact is required" });
    }

    if (!req.session.generatedOTPDelivery) {
      req.session.generatedOTPDelivery = {};
    }
    const generatedOTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    req.session.generatedOTPDelivery[phoneNumber] = {
      OTP: generatedOTP,
    };
    console.log("Session after setting OTP:", req.session.generatedOTPDelivery);

    await sendOtpViaSMS(phoneNumber, generatedOTP);

    return res.status(200).json({
      message: "Order picked successfully",
    });
  } catch (error) {
    console.error("Error picking order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const ondelivery = async (req, res) => {
  const deliveryManId = req.user._id;

  console.log(deliveryManId,"called")
  

  try {
    const preparedOrders = await deliveryModel
      .findOne({
        deliveryManId: deliveryManId,
        status: "picked",
      })
      .populate({ path: "products.product", name: "name" });

    if (!preparedOrders || preparedOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found ",
      });
    }

    const formatedProducts = preparedOrders.products.map((data) => {
      return { name: data.product.name, quantity: data.quantity };
    });

    const formatedDelivery = {
      customerName: preparedOrders.customer.name,
      address: preparedOrders.customer.address,
      contact: preparedOrders.customer.contact,
      geolocation: preparedOrders.customer.geolocation,
      orderIdDeliveryId: preparedOrders.orderIdDeliveryId,
      products: formatedProducts,
      total: preparedOrders.total,
    };

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders: formatedDelivery,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deliveryOTPcheck = async (req, res) => {
  const { contact, otp, orderId, deliveryId } = req.body;
  const phoneNumber = `+91${9080877144}` || `+91${contact}`;
  const deliveryManId = req.user._id;

  if (
    !req.session.generatedOTPDelivery ||
    !req.session.generatedOTPDelivery[phoneNumber]
  ) {
    return res.status(404).json({
      message: "Phone Number not found, regenerate OTP",
    });
  }

  const storedOtpData = req.session.generatedOTPDelivery[phoneNumber];

  try {
    const Orders = await OrderModel.findOne({ orderId });
    const delivery = await deliveryModel.findOne({
      orderIdDeliveryId: deliveryId,
    });

    console.log(Orders, delivery);

    if (!Orders || Orders.length === 0) {
      return res.status(404).json({
        message: "No orders found with prepared status",
      });
    }

    if (!delivery || delivery.length === 0) {
      return res.status(404).json({
        message: "No delivery found with prepared status",
      });
    }

    if (storedOtpData.OTP !== otp) {
      return res.status(501).json({ message: "ivalid otp" });
    }

    Orders.deliveredTime = new Date();
    Orders.orderPicked.status = "delivered";
    Orders.products.map((data) => (data.orderStatus = "delivered"));
    await Orders.save();

    delivery.status = "delivered";
    delivery.deliverdTime = new Date();
    await delivery.save();

    const deliveryMan = await DeliveryUser.findById(deliveryManId);
    deliveryMan.deliveryStatus = "available";
    await deliveryMan.save();

    delete req.session.generatedOTPDelivery[phoneNumber];

    return res.status(200).json({
      message: "Orders deliverd successfully",
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deliverdOrder = async (req, res) => {
  const deliveryManId = req.user._id;

  try {
    const preparedOrders = await deliveryModel
      .find({
        deliveryManId: deliveryManId,
        status: "delivered",
      })
      .populate({ path: "products.product", name: "name" });

    if (!preparedOrders || preparedOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found ",
      });
    }

    const formatedDelivery = preparedOrders.map((preparedOrders) => {
      return {
        customerName: preparedOrders.customer.name,
        deliverdTime: preparedOrders.deliverdTime,
        products: preparedOrders.products?.map((data) => {
          return { name: data.product.name, quantity: data.quantity };
        }),
        total: preparedOrders.total,
      };
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      orders: formatedDelivery,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deliveryManInfo = async (req, res) => {
  try {
    const deliveryMan = await DeliveryUser.find({ accepted: "true" });

    if (!deliveryMan || deliveryMan.length === 0) {
      return res.status(404).json({
        message: "No delivery man  found ",
      });
    }

    const deliveryManFormat = deliveryMan.map((data) => {
      return {
        deliveryManId: data._id,
        name: data.name,
        email: data.email,
        contact: data.phone,
        status: data.deliveryStatus,
        blocked: data.blocked,
      };
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      deliveryMan: deliveryManFormat,
    });
  } catch (error) {
    console.error("Error retrieving delivery Man info:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const SingleDeliveryManInfo = async (req, res) => {
  const deliveryManId = req.params.id;
  try {
    const deliverdOrders = await deliveryModel
      .find({
        deliveryManId: deliveryManId,
        status: "delivered",
      })
      .populate({ path: "products.product", name: "name" });

    if (!deliverdOrders || deliverdOrders.length === 0) {
      return res.status(404).json({
        message: "No orders found ",
      });
    }

    const formatedDelivery = deliverdOrders.map((preparedOrders) => {
      return {
        customerName: preparedOrders.customer.name,
        customerContact: preparedOrders.customer.contact,
        customerAddress: preparedOrders.customer.address,
        deliverdTime: preparedOrders.deliverdTime,
        pickedTime: preparedOrders.pickedTime,
        products: preparedOrders.products?.map((data) => {
          return { name: data.product.name, quantity: data.quantity };
        }),
        total: preparedOrders.total,
      };
    });

    return res.status(200).json({
      message: "Orders retrieved successfully",
      deliveryMan: formatedDelivery,
    });
  } catch (error) {
    console.error("Error retrieving delivery Man info:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const deliveryManLOcationUpdate = async (req, res) => {
  const { orderId, geolocation } = req.body;
  console.log(orderId);

  try {
    const preparedOrder = await OrderModel.findOne({ orderId });

    if (!preparedOrder) {
      return res.status(404).json({
        message: "No orders found with the given orderId",
      });
    }

    preparedOrder.orderPicked.Geolocation = geolocation;

    await preparedOrder.save();

    socket.ioObject.sockets.emit(
      "deliveryManLocationUpdate",
      preparedOrder.orderPicked.Geolocation
    );

    res.json({
      message: "Delivery man's location updated successfully",
      updatedLocation: preparedOrder.orderPicked.Geolocation,
    });
  } catch (error) {
    console.error("Error picking order:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = {
  deliveryDisplayBox,
  orderPicked,
  ondelivery,
  deliveryOTPcheck,
  deliverdOrder,
  deliveryManInfo,
  SingleDeliveryManInfo,
  deliveryManLOcationUpdate,
};
