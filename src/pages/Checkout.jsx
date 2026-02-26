// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import {
  getUserByPhone,
  createUser,
  getUserAddress,
  upsertUserAddress,
  createOrder,
  insertOrderItems,
  clearUserCart,
} from "../api/hasura";

/* global Razorpay */

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const userPhone = localStorage.getItem("userPhone");

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [newAddress, setNewAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);

  // Get lat/lng from full address
  const getLatLngFromAddress = async (fullAddress) => {
    const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // replace with real key
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        fullAddress
      )}&key=${API_KEY}`
    );
    const data = await response.json();
    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { latitude: location.lat, longitude: location.lng };
    } else throw new Error("Geocoding failed");
  };

  // Load user & address
  useEffect(() => {
    const loadUser = async () => {
      if (!userPhone) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      let u = await getUserByPhone(userPhone);
      if (!u) u = await createUser(userPhone, `${userPhone}@temp.com`);
      setUser(u);

      const addr = await getUserAddress(u.id);
      setAddress(addr || null);
      setShowAddressForm(!addr);
      setLoading(false);
    };

    loadUser();
  }, [userPhone, navigate]);

  // Save address
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.address_line) return alert("Address is required");

    try {
      const fullAddress = `${newAddress.address_line}, ${newAddress.city}, ${newAddress.state}, ${newAddress.pincode}`;
      const location = await getLatLngFromAddress(fullAddress);

      const updatedAddress = await upsertUserAddress({
        userId: user.id,
        ...newAddress,
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (updatedAddress) {
        setAddress({ ...updatedAddress });
        setShowAddressForm(false);
      }

      setNewAddress({ address_line: "", city: "", state: "", pincode: "" });
    } catch (err) {
      console.error(err);
      alert("Address save failed");
    }
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // Place order
  const handlePlaceOrder = async () => {
    if (!address) return alert("Please add an address first");

    const totalAmount = getTotal();

    // -------------------- ONLINE PAYMENT --------------------
    if (paymentMethod === "online") {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/create-order`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalAmount }),
          }
        );
        const orderData = await res.json();

        const options = {
          key: "rzp_test_SGh1UwVFh4saU0",
          amount: orderData.amount,
          currency: "INR",
          name: "Cravio User",
          description: "Food Order Payment",
          order_id: orderData.id,
          handler: async function (response) {
            const order = await createOrder({
              user_id: user.id,
              address_id: address.id,
              total_amount: totalAmount,
              status: "paid",
              payment_method: paymentMethod,
              payment_id: response.razorpay_payment_id,
              delivery_latitude: address.latitude,
              delivery_longitude: address.longitude,
            });

            const orderItems = cart.map((item) => ({
              order_id: order.id,
              dish_id: item.id,
              quantity: item.quantity,
              price: item.price,
              restaurant_id: item.restaurant_id,
            }));

            await insertOrderItems(orderItems);
            await clearUserCart(user.id);
            clearCart();
            navigate("/success-order", { state: { id: order.id } });
          },
          prefill: {
            email: `${userPhone}@temp.com`,
            contact: userPhone,
          },
          theme: { color: "#F87060" },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        alert("Payment failed");
      }
      return;
    }

    // -------------------- COD --------------------
    try {
      const order = await createOrder({
        user_id: user.id,
        address_id: address.id,
        total_amount: totalAmount,
        status: "pending",
        payment_method: paymentMethod,
        delivery_latitude: address.latitude,
        delivery_longitude: address.longitude,
      });

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        price: item.price,
        restaurant_id: item.restaurant_id,
      }));

      await insertOrderItems(orderItems);
      await clearUserCart(user.id);
      clearCart();
      navigate("/success-order", { state: { id: order.id } });
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 pt-24 pb-32 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            Your cart is empty 🛒
          </p>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.restaurant_id}`}
                  className="bg-white rounded-2xl shadow-md p-4 flex gap-4"
                >
                  <img
                    src={item.image_url || "/dish-placeholder.jpg"}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <p className="text-xs text-gray-400">{item.restaurant_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 mt-6">
              <h2 className="font-semibold text-gray-700 mb-2">Delivery Address</h2>

              {address && !showAddressForm ? (
                <>
                  <div className="text-gray-600 text-sm">
                    <p>{address.address_line}</p>
                    <p>
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 py-2 px-4 bg-orange-500 text-white rounded-lg"
                  >
                    Change Address
                  </button>
                </>
              ) : (
                showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="space-y-2">
                    <input
                      placeholder="Address Line"
                      className="w-full border px-3 py-2 rounded-lg"
                      value={newAddress.address_line}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address_line: e.target.value })
                      }
                    />
                    <input
                      placeholder="City"
                      className="w-full border px-3 py-2 rounded-lg"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                    <input
                      placeholder="State"
                      className="w-full border px-3 py-2 rounded-lg"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                    <input
                      placeholder="Pincode"
                      className="w-full border px-3 py-2 rounded-lg"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, pincode: e.target.value })
                      }
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-orange-500 text-white rounded-lg"
                    >
                      Save Address
                    </button>
                  </form>
                )
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 mt-6">
              <h2 className="font-semibold text-gray-700 mb-3">Payment Method</h2>

              <label className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
              </label>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-5 mt-6">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}