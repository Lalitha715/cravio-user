import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Restaurants from "./pages/Restaurants";
import Profile from "./pages/Profile";
import RestaurantDetail from "./pages/RestaurantDetail";
import {Toaster} from 'react-hot-toast';
import Orders from "./pages/Orders";

export default function App() {
  return (
    <>
    <Toaster/>
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* App */}
      <Route path="/home" element={<Home />} />
      <Route path="/orders" element={<Orders/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/restaurant" element={<Restaurants/>}/>
      <Route path="/restaurant/:id" element={<RestaurantDetail/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
    </>
  );
}
