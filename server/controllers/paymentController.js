import { instance } from "../server.js";
import crypto from "crypto";

export const processPaymentController = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).send({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in process-payment controller",
      error,
    });
  }
};

export const getKeyController = async (req, res) => {
  try {
    return res.status(200).send({
      success: true,
      key: process.env.RAZORPAY_API_KEY,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in getKey controller",
      error,
    });
  }
};

export const verificationPaymentController = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = razorpay_signature === expectedSignature;

    if (!isAuthentic) {
      return res.status(403).send({
        success: false,
        message: "Authentication Error",
      });
    }

    // console.log("Razorpay signature: ", razorpay_signature);
    // console.log("Expected signature: ", expectedSignature);
    // res.status(200).send({
    //   success: true,
    // });

    return res.redirect(
      `http://localhost:5173/paymentSuccess?reference=${razorpay_payment_id}`
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Errro in verification Payment controller",
      error,
    });
  }
};
