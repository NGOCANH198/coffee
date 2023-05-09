import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "../pages/homepage";
import Products from "../pages/products";
import ProductDetail from "../pages/products/productDetail";
import Orders from "../pages/orders";

const SwitchRoutes = () => {
  return (
    <Routes>
      <Route exact path="/login" element={<Homepage />} />
      <Route path="/products">
        <Route index element={<Products />} />
        <Route path=":id" element={<ProductDetail />} />
      </Route>
      <Route path="/orders">
        <Route index element={<Orders />} />
        {/* <Route path=":id" element={<ProductDetail />} /> */}
      </Route>
      <Route path="*" element={<Navigate to="/products" />} />
    </Routes>
  );
};

export default SwitchRoutes;
