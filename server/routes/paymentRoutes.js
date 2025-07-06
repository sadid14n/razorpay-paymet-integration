import express from "express";
import {
  getKeyController,
  processPaymentController,
  verificationPaymentController,
} from "../controllers/paymentController.js";

const router = express.Router();

// routes
router.post("/process-payment", processPaymentController);
router.get("/getKey", getKeyController);
router.post("/verification-payment", verificationPaymentController);

export default router;
