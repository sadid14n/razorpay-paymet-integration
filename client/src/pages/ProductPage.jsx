import React from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductPage = ({ products }) => {
  const navigate = useNavigate();

  const handleBuy = async (amount) => {
    try {
      // Step 1: Get Razorpay Key
      const { data: keyData } = await axios.get("/api/v1/payment/getKey");
      const { key } = keyData;

      // Step 2: Create Razorpay Order
      const { data: orderData } = await axios.post(
        "/api/v1/payment/process-payment",
        { amount }
      );
      const { order } = orderData;

      if (!order || !key) {
        return toast.error("Failed to initiate payment");
      }

      // Step 3: Razorpay Options
      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Sadid Alam Pvt Ltd",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id,
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9000000000",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "/api/v1/payment/verification-payment",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: order.amount,
                name: "Guest User",
                email: "guest@example.com",
                contact: "9000000000",
              }
            );

            if (verifyRes.data.success) {
              navigate(
                `/paymentSuccess?reference=${response.razorpay_payment_id}`
              );
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            toast.error("Server error during payment verification");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled");
          },
        },
      };

      // Step 4: Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-gray-300 flex flex-wrap gap-5 p-6 justify-around">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white flex justify-between items-center"
          >
            <div className="w-[200px] h-[200px]">
              <img
                src={product.img}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="px-5 mt-2 flex flex-col justify-between">
              <div>
                <h1 className="font-semibold">{product.title}</h1>
                <p>{product.description}</p>
              </div>
              <div className="flex justify-between my-3 pb-3">
                <p className="font-bold">Rs: {product.price}</p>
                <button
                  className="bg-green-600 px-4 py-1 rounded-md text-white hover:bg-green-700"
                  onClick={() => handleBuy(product.price)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductPage;
