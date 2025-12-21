import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Restaurants from "./pages/Restaurants";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      {/* Default */}
      <Route path="/" element={<Navigate to="/register" />} />

      {/* Auth */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* App */}
      <Route path="/home" element={<Home />} />
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/restaurant" element={<Restaurants/>}/>
      <Route path="/restaurant/:id" element={<Restaurants/>}/>
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
  );
}
