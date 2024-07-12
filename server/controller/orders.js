const OrderModel = require("../model/order");
const { Quantity } = require("./cart");

const allOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  try {
    const totalOrders = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);
    const getAllOrders = await OrderModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ _id: -1 });

    const formattedOrders = getAllOrders.map((order) => ({
      orderId: order.orderId,
      customerName: order.customer.name,
      paymentMethod: order.payment.paymentMethod,
      paymentStatus: order.payment.status,
      deliveryStatus: order.orderPicked.status,
      orderDate: order.date,
      total: order.total,
    }));

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: formattedOrders,
      currentPage: page,
      totalPages: totalPages,
      totalOrders: totalOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const ordersToday = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const ordersCreatedToday = await OrderModel.find({
      createdAt: { $gte: startOfToday, $lt: endOfToday },
    }).sort({ _id: -1 });

    const formattedOrders = ordersCreatedToday.map((order) => ({
      orderId: order.orderId,
      customerName: order.customer.name,
      paymentMethod: order.payment.paymentMethod,
      paymentStatus: order.payment.status,
      deliveryStatus: order.orderPicked.status,
      orderDate: order.date,
      total: order.total,
    }));

    res.status(200).json({
      message: "Today's orders retrieved successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const singleOrders = async (req, res) => {
  const orderId = req.params.id;

  try {
    const getOrders = await OrderModel.findOne({ orderId })
      .sort({ _id: -1 })
      .populate("products.product")
      .populate("appliedCoupon");

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: getOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const deliveryStatusChange = async (req, res) => {
  const orderId = req.params.id;
  const { status, productId } = req.body;

  if (!orderId || !status || !productId) {
    return res.status(400).json({
      message: "Missing orderId, status, or productId in the request body",
    });
  }

  try {
    const getOrders = await OrderModel.findOne({ orderId })
      .populate("products.product")
      .populate("appliedCoupon");

    if (!getOrders) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const productIndex = getOrders.products.findIndex(
      (data) => data.product._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in order",
      });
    }

    getOrders.products[productIndex].orderStatus = status;

    const createdData = getOrders.products.filter(
      (item) => item.orderStatus === "created"
    );
    const confirmedData = getOrders.products.filter(
      (item) => item.orderStatus === "confirmed"
    );
    const preparedData = getOrders.products.filter(
      (item) => item.orderStatus === "prepared"
    );

    // console.log(preparedData, preparedData.length, getOrders.products.length);

    if (createdData.length === getOrders.products.length) {
      getOrders.orderPicked.status = "created";
    }
    if (confirmedData.length === getOrders.products.length) {
      getOrders.orderPicked.status = "confirmed";
    }
    if (preparedData.length === getOrders.products.length) {
      getOrders.orderPicked.status = "prepared";
    }

    await getOrders.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      orders: getOrders,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const userOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const userOrders = await OrderModel.find({
      "customer.userId": userId,
      "payment.status": "completed",
    })
      .sort({ _id: -1 })
      .populate("products.product");
    const formattedOrders = userOrders.map((order) => ({
      coupon: order.appliedCouponDiscount,
      products: order.products,
      paymentStatus: order.payment.status,
      orderDate: order.date,
      total: order.total,
      orderStatus: order.orderPicked,
      deliveredTime: order.deliveredTime,
    }));

    res.status(200).json({
      message: "Today's orders retrieved successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const GetSingleUsersOrders = async (req, res) => {
  const userId = req.params.id;

  try {
    const userOrders = await OrderModel.find({
      "customer.userId": userId,
      "payment.status": "completed",
    })
      .sort({ _id: -1 })
      .populate("products.product");

    console.log(userOrders);
    const formattedOrders = userOrders.map((order) => ({
      coupon: order.appliedCouponDiscount,
      products: order.products,
      paymentStatus: order.payment.status,
      orderDate: order.date,
      total: order.total,
      deliveredTime: order.deliveredTime,
      Picked: order.orderPicked.date,
      deliveryMan: order.orderPicked.name,
      deliveryManContact: order.orderPicked.contact,
    }));

    res.status(200).json({
      message: "Today's orders retrieved successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const allOrdersDate = async (req, res) => {
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({
      message: "Date query parameter is required",
    });
  }

  try {
    const parsedDate = new Date(date);
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const getAllOrders = await OrderModel.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    }).sort({ _id: -1 });

    const formattedOrders = getAllOrders.map((order) => ({
      orderId: order.orderId,
      customerName: order.customer.name,
      paymentMethod: order.payment.paymentMethod,
      paymentStatus: order.payment.status,
      orderDate: order.date,
      total: order.total,
    }));

    res.status(200).json({
      message: "Orders retrieved successfully",
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const ordersTodayData = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const ordersCreatedToday = await OrderModel.find({
      createdAt: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
      "payment.status": "completed",
    }).sort({ _id: -1 });

    // console.log(ordersCreatedToday, "ss");

    const totalAmount = ordersCreatedToday.reduce((total, data) => {
      return (total += data.total);
    }, 0);

    const totalOrders = ordersCreatedToday.length;

    const OrderStatus = {
      created: 0,
      confirmed: 0,
      prepared: 0,
      picked: 0,
      delivered: 0,
      cancelled: 0,
    };

    ordersCreatedToday.forEach((order) => {
      order.products.forEach((product) => {
        if (OrderStatus.hasOwnProperty(product.orderStatus)) {
          OrderStatus[product.orderStatus]++;
        }
      });
    });

    res.status(200).json({
      message: "Today's orders data retrieved successfully",
      orders: { totalAmount, totalOrders, OrderStatus },
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const allOrdersByDate = async (req, res) => {
  const { filter, date } = req.query;
  let startDate, endDate;

  console.log(filter, date);

  switch (filter) {
    case "day":
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "week":
      startDate = new Date(date);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "month":
      startDate = new Date(date);
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "year":
      startDate = new Date(date);
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    default:
      return res.status(400).send("Invalid filter");
  }

  try {
    const orders = await OrderModel.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate({ path: "products.product", select: "name" });

    // console.log(orders.products.product.map((data) => data));

    const totalAmount = orders.reduce((total, data) => {
      return (total += data.total);
    }, 0);
    const totalOrders = orders.length;

    const userData = orders.map((data) => {
      return {
        userName: data.customer.name,
        createdAt: data.createdAt,
        total: data.total,
        products: data.products.map((data) => {
          return {
            name: data.product.name,
            quantity: data.quantity,
          };
        }),
      };
    });

    res.status(200).json({
      message: "Today's orders data retrieved successfully",
      orders: { totalAmount, totalOrders, userData },
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

const comparisonData = async (req, res) => {
  try {
    const orders = await OrderModel.find().populate({
      path: "products.product",
      select: "name",
    });

    // console.log(orders.products.product.map((data) => data));

    const userData = orders.map((data) => {
      return {
        userName: data.customer.name,
        createdAt: data.createdAt,
        total: data.total,
        products: data.products.map((data) => {
          return {
            name: data.product.name,
            quantity: data.quantity,
          };
        }),
      };
    });

    res.status(200).json({
      message: "Today's orders data retrieved successfully",
      orders: { userData },
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error,
    });
  }
};

module.exports = {
  allOrders,
  ordersToday,
  singleOrders,
  deliveryStatusChange,
  userOrders,
  GetSingleUsersOrders,
  allOrdersDate,
  ordersTodayData,
  allOrdersByDate,
  comparisonData,
};
