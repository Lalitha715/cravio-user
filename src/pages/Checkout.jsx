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

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const userPhone = localStorage.getItem("userPhone");

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!userPhone) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      let u = await getUserByPhone(userPhone);
      if (!u) {
        u = await createUser(userPhone, `${userPhone}@temp.com`);
      }
      setUser(u);

      const addr = await getUserAddress(u.id);
      setAddress(addr);

      // If no address, show "Add Address" button
      setShowAddressForm(!addr);
      setLoading(false);
    };

    loadUser();
  }, [userPhone, navigate]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!newAddress.address_line) return alert("Address is required");

    await upsertUserAddress({
      userId: user.id,
      ...newAddress,
    });

    const addr = await getUserAddress(user.id);
    setAddress(addr);
    setShowAddressForm(false);
    setNewAddress({ address_line: "", city: "", state: "", pincode: "" });
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handlePlaceOrder = async () => {
    if (!address) {
      alert("Please add an address first");
      return;
    }

    try {
      const order = await createOrder({
        user_id: user.id,
        total_amount: getTotal(),
        status: "pending",
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

    
      navigate("/success-order");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
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
          <p className="text-center text-gray-400 mt-20">Your cart is empty 🛒</p>
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
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      {item.name}
                      {item.is_veg ? (
                        <span className="w-3 h-3 bg-green-600 rounded-full inline-block"></span>
                      ) : (
                        <span className="w-3 h-3 bg-red-600 rounded-full inline-block"></span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <p className="text-xs text-gray-400">{item.restaurant_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Section */}
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
                    className="mt-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Change Address
                  </button>
                </>
              ) : !address && !showAddressForm ? (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Add Address
                </button>
              ) : null}

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Address Line"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newAddress.address_line}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, address_line: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, pincode: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Total + Place Order */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mt-6 sticky bottom-4">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
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
