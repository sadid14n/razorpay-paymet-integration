import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const reference = query.get("reference");
  return (
    <div className="h-screen w-full ">
      <h1 className="text-center text-5xl font-bold pt-10 text-green-400">
        Payment Successfull
      </h1>
      <div className="flex justify-center mt-14">
        {reference && (
          <p className="text-3xl ">
            <span className="font-bold">Reference ID:</span> {reference}
          </p>
        )}
      </div>

      <div className="flex justify-center mt-30">
        <button
          className="bg-green-400 py-3 px-5 rounded-md font-bold  cursor-pointer"
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
