// src/pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import {
  getUserByEmail,
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

  const userEmail = localStorage.getItem("userEmail");
  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const [addressForm, setAddressForm] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
  });

  // 💰 Total
  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  // 👤 Load user + address
  useEffect(() => {
    const loadUser = async () => {
      if (!userId && !userEmail) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      let u = null;

      if (userId) {
        u = { id: userId };
      } else {
        u = await getUserByEmail(userEmail);
      }

      if (!u) {
        alert("User not found");
        navigate("/login");
        return;
      }

      setUser(u);

      const addr = await getUserAddress(u.id);
      if (addr) {
        setAddress(addr);
        setAddressForm(addr);
        setShowAddressForm(false);
      } else {
        setShowAddressForm(true);
      }

      setLoading(false);
    };

    loadUser();
  }, [userEmail, userId, navigate]);

  // 📍 Save Address
  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!addressForm.address_line || !addressForm.city) {
      return alert("Fill required fields");
    }

    try {
      const updated = await upsertUserAddress({
        userId: user.id,
        ...addressForm,
      });

      setAddress(updated);
      setShowAddressForm(false);
      alert("Address saved ✅");
    } catch (err) {
      console.error(err);
      alert("Address save failed");
    }
  };

  // 🧾 Create Order + Items
  const processOrder = async (paymentId = null, status = "pending") => {
    const totalAmount = getTotal();

    const order = await createOrder({
      user_id: user.id,
      address_id: address.id,
      total_amount: totalAmount,
      status,
      payment_method: paymentMethod,
      payment_id: paymentId,
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
  };

  // 💳 Place Order
  const handlePlaceOrder = async () => {
    if (!address) return alert("Add address first");
    if (cart.length === 0) return alert("Cart is empty");

    const totalAmount = getTotal();

    // 💻 ONLINE PAYMENT
    if (paymentMethod === "online") {
      try {
        setPaying(true);

        const options = {
          key: "rzp_test_SGh1UwVFh4saU0",
          amount: totalAmount * 100,
          currency: "INR",
          name: "Cravio",
          description: "Food Order Payment",

          handler: async function (response) {
            console.log("Payment:", response);

            if (!response.razorpay_payment_id) {
              alert("Payment failed");
              setPaying(false);
              return;
            }

            try {
              await processOrder(
                response.razorpay_payment_id,
                "paid"
              );
            } catch (err) {
              console.error(err);
              alert("Order save failed after payment");
            }

            setPaying(false);
          },

          modal: {
            ondismiss: function () {
              alert("Payment cancelled");
              setPaying(false);
            },
          },

          prefill: {
            email: userEmail || "demo@cravio.com",
          },

          theme: {
            color: "#F87060",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error(err);
        alert("Payment error");
        setPaying(false);
      }

      return;
    }

    // 💵 COD
    try {
      setPaying(true);
      await processOrder(null, "pending");
    } catch (err) {
      console.error(err);
      alert("COD failed");
    }
    setPaying(false);
  };

  if (loading) return <p className="pt-24 text-center">Loading...</p>;

  // 🍽 Group cart by restaurant
  const groupedCart = Object.values(
    cart.reduce((acc, item) => {
      if (!acc[item.restaurant_id]) {
        acc[item.restaurant_id] = {
          restaurant_name: item.restaurant_name,
          items: [],
        };
      }
      acc[item.restaurant_id].items.push(item);
      return acc;
    }, {})
  );

  return (
    <>
      <Header />

      <div className="min-h-screen px-4 pt-24 pb-32 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400 mt-20">
            Your cart is empty 🛒
          </p>
        ) : (
          <>
            {groupedCart.map((group, idx) => (
              <div key={idx} className="mb-6">
                <h2 className="text-lg font-bold text-orange-600 mb-2">
                  {group.restaurant_name}
                </h2>

                <AIRecommendations
                  restaurantId={group.items[0].restaurant_id}
                />

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={`${item.id}-${item.restaurant_id}`}
                      className="bg-white p-4 rounded-2xl shadow-md flex gap-4"
                    >
                      <img
                        src={
                          item.image_url ||
                          "/dish-placeholder.jpg"
                        }
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover"
                      />

                      <div className="flex-1">
                        <h2 className="font-semibold">
                          {item.name}
                        </h2>
                        <p>₹{item.price}</p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Address */}
            <div className="bg-white p-4 rounded-2xl shadow mb-6">
              <h2 className="font-semibold mb-2">
                Delivery Address
              </h2>

              {address && !showAddressForm ? (
                <>
                  <p>{address.address_line}</p>
                  <p>
                    {address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>

                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-2 bg-orange-500 text-white px-4 py-2 rounded"
                  >
                    Change
                  </button>
                </>
              ) : (
                <form
                  onSubmit={handleAddressSubmit}
                  className="space-y-2"
                >
                  <input
                    placeholder="Address"
                    className="w-full border p-2 rounded"
                    value={addressForm.address_line}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address_line: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="City"
                    className="w-full border p-2 rounded"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        city: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="State"
                    className="w-full border p-2 rounded"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        state: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Pincode"
                    className="w-full border p-2 rounded"
                    value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        pincode: e.target.value,
                      })
                    }
                  />

                  <button className="w-full bg-orange-500 text-white py-2 rounded">
                    Save Address
                  </button>
                </form>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white p-4 rounded-2xl shadow mb-6">
              <h2 className="font-semibold mb-3">
                Payment Method
              </h2>

              <label className="flex gap-2 mb-2">
                <input
                  type="radio"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="flex gap-2">
                <input
                  type="radio"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                Online Payment
              </label>
            </div>

            {/* Total */}
            <div className="bg-white p-5 rounded-2xl shadow">
              <div className="flex justify-between text-lg font-semibold mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={paying}
                className="w-full py-3 rounded-xl text-white bg-gradient-to-r from-red-500 to-pink-500"
              >
                {paying ? "Processing..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </>
  );
}