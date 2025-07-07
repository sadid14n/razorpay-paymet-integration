// models/paymentModel.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["success", "failed"], default: "success" },
    user: {
      name: String,
      email: String,
      contact: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
