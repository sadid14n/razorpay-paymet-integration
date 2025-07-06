import { Routes, Route } from "react-router-dom";
import ProductPage from "./pages/ProductPage";
import { products } from "./data/productData.js";
import PaymentSuccess from "./pages/paymentSuccess.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductPage products={products} />} />
      <Route path="/paymentSuccess" element={<PaymentSuccess />} />
    </Routes>
  );
};

export default App;
