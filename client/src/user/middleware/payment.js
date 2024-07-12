import axios from "axios";

const handlePayment = async (amount, name, email, contact, onSucess) => {
  const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";

  try {
    const orderUrl = `${BASE_URL}/auth/create-order`;
    const { data } = await axios.post(orderUrl, { amount });

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: "SS BBQ",
      description: "Test Transaction",
      order_id: data.order_id,
      handler: async (response) => {
        try {
          const paymentId = response.razorpay_payment_id;
          const orderId = response.razorpay_order_id;
          const signature = response.razorpay_signature;
          const paymentUrl = `${BASE_URL}/auth/payment-capture`;

          const captureResponse = await axios.post(paymentUrl, {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          });

          if (captureResponse.status === 200) {
            onSucess();
          }
        } catch (error) {
          console.error("Payment handler failed", error);
          alert("Payment failed");
          return false;
        }
      },
      prefill: {
        name,
        email,
        contact,
      },
      notes: {
        address: "Your Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    // console.log(error)
    // console.error("Order creation failed", error);
    return false;
  }
};

export default handlePayment;
