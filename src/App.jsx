import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home";
import client from "./apolloClient";
import RestaurantMenu from "./pages/RestaurantMenu";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Search from "./pages/Search";
import SuccessSignup from "./pages/Auth/SuccessSignup";
import SuccessLogin from "./pages/Auth/SuccessLogin";
import Checkout from "./pages/Checkout";
import SuccessOrder from "./pages/SuccessOrder";
import { Toaster } from "react-hot-toast";

import AddRestaurant from "./pages/owner/AddRestaurant";
import MyRestaurants from "./pages/owner/MyRestaurants";

export default function App() {
  const currentUser = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Test Owner",
    email: "owner@example.com"
  };

  return (
    <ApolloProvider client={client}>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup-success" element={<SuccessSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-success" element={<SuccessLogin />} />
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success-order" element={<SuccessOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/restaurant/:id" element={<RestaurantMenu />} />

          <Route path="/owner/add-restaurant" element={<AddRestaurant currentUser={currentUser} />} />
          <Route path="/owner/my-restaurants" element={<MyRestaurants currentUser={currentUser} />} />


        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}
