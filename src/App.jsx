import {ApolloProvider} from "@apollo/client";
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

export default function App() {
  return (
    <ApolloProvider client={client}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/orders" element={<Orders/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/restaurant/:id" element={<RestaurantMenu/>}/>
      </Routes>
    </BrowserRouter>
    </ApolloProvider>
  );
}
