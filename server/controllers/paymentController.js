import { instance } from "../server.js";
import crypto from "crypto";
import Payment from "../models/paymentModel.js";

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
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      email,
      contact,
      amount,
    } = req.body;

    console.log(req.body);

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

    const paymentData = new Payment({
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
      amount,
      currency: "INR",
      status: "success",
      user: { name, email, contact },
    });

    await paymentData.save();

    console.log(paymentData);

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Errro in verification Payment controller",
      error,
    });
  }
};
