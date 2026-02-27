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
import AIRecommendations from "../components/AIRecommendation";

/* global Razorpay */

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const userPhone = localStorage.getItem("userPhone");

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [addressForm, setAddressForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);

  // Calculate total
  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

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
      if (addr) setAddressForm(addr);
      setShowAddressForm(!addr);
      setLoading(false);
    };
    loadUser();
  }, [userPhone, navigate]);

  // Save/update address in Hasura
  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.address_line || !addressForm.city) {
      return alert("Please fill all required address fields");
    }
    try {
      const updatedAddress = await upsertUserAddress({
        userId: user.id,
        ...addressForm,
      });
      setAddress(updatedAddress);
      setShowAddressForm(false);
      alert("Address saved successfully!");
    } catch (err) {
      console.error("Address save failed:", err);
      alert("Failed to save address");
    }
  };

  // Place order + Razorpay (frontend-only)
  const handlePlaceOrder = async () => {
    if (!address) return alert("Please add an address first");

    const totalAmount = getTotal();

    if (paymentMethod === "online") {
      try {
        // Razorpay frontend-only
        const options = {
          key: "rzp_test_SGh1UwVFh4saU0", // replace with your key
          amount: totalAmount * 100, // in paise
          currency: "INR",
          name: "Cravio",
          description: "Food Order Payment",
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
        console.error("Payment failed:", err);
        alert("Payment failed. Check console for details.");
      }
      return;
    }

    // Cash on Delivery
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
      console.error("COD failed:", err);
      alert("Failed to place order");
    }
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;

  // Group cart items by restaurant
  const groupedCart = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.restaurant_id]) acc[item.restaurant_id] = {
        restaurant_name: item.restaurant_name,
        items: [],
      };
      acc[item.restaurant_id].items.push(item);
      return acc;
    }, {})
  );

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 pt-24 pb-32 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            Your cart is empty 🛒
          </p>
        ) : (
          <>
            {/* Dishes grouped by restaurant */}
            {groupedCart.map((group, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-lg font-bold mb-2 text-orange-600">
                  {group.restaurant_name}
                </h2>

                {/* AI Suggestions */}
                <AIRecommendations restaurantId={group.items[0].restaurant_id} />

                <div className="space-y-4">
                  {group.items.map((item) => (
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
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">Delivery Address</h2>
              {address && !showAddressForm ? (
                <>
                  <p className="text-gray-600 text-sm">{address.address_line}</p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 py-2 px-4 bg-orange-500 text-white rounded-lg"
                  >
                    Change Address
                  </button>
                </>
              ) : (
                <form onSubmit={handleAddressSubmit} className="space-y-2">
                  <input
                    placeholder="Address Line"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={addressForm.address_line}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, address_line: e.target.value })
                    }
                  />
                  <input
                    placeholder="City"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                  />
                  <input
                    placeholder="State"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                  />
                  <input
                    placeholder="Pincode"
                    className="w-full border px-3 py-2 rounded-lg"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-orange-500 text-white rounded-lg"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
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

            {/* Total & Place Order */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
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