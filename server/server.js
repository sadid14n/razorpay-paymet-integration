import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Razorpay from "razorpay";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// routes
app.use("/api/v1/payment", paymentRoutes);

app.listen(port, () => {
  console.log(`Server running on port - ${port}`);
});
