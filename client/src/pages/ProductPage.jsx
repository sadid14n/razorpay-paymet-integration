import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const ProductPage = ({ products }) => {
  const handleBuy = async (amount) => {
    try {
      const { data: keyData } = await axios.get("/api/v1/payment/getKey");
      const { data: orderData } = await axios.post(
        "/api/v1/payment//process-payment",
        {
          amount,
        }
      );
      const { order } = orderData;
      const { key } = keyData;

      const options = {
        key,
        amount,
        currency: "INR",
        name: "Sadid Alam Pvt Ltd", //your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: order.id,
        callback_url: "/api/v1/payment/verification-payment",
        prefill: {
          name: "Gaurav Kumar", //your customer's name
          email: "gaurav.kumar@example.com",
          contact: "9000090000", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      return toast.error("Something went wrong. Please try again later");
    }
  };
  return (
    <>
      <div className="bg-gray-300 flex flex-wrap gap-5 p-6 justify-around">
        <Toaster />
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white flex justify-between items-center"
          >
            <div className="w-[200px] h-[200px]">
              <img
                src={product.img}
                alt=""
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
                  className="bg-green-600 px-4 py-1 rounded-md cursor-pointer"
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
