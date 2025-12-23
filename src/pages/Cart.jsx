// src/pages/Cart.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/hasura";
import BottomNav from "../components/BottomNav";

export default function Cart() {
  const { cart, addToCart, removeFromCart, totalAmount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const navigate = useNavigate();
  
  // 🟡 Empty cart
  if (!cart.length) {
    <div>
    return <p className="p-6 text-center">Cart is empty</p>;
    <BottomNav/>
    </div>
  }

  const handlePlaceOrder = async () => {
    try {
      // 🔐 Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) {
        toast.error("Please login first");
        return;
      }

      // 🍽️ All dishes must belong to same restaurant
      const restaurantId = cart[0]?.restaurant_id;
      if (!restaurantId) {
        toast.error("Restaurant not detected. Please re-add items.");
        return;
      }

      // ✅ Hasura expects jsonb → pass ARRAY, not stringify
      const orderData = {
        user_id: user.id,
        restaurant_id: restaurantId,
        items: cart.map((item) => ({
          dish_id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        total_amount: totalAmount,
        payment_method: paymentMethod, // ✔ only if column exists
        status:"Placed",
      };

      await placeOrder(orderData);

      toast.success("Order placed successfully 🎉");
      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="p-4">
      <BottomNav/>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-3"
        >
          {/* IMAGE */}
          <img
            src={item.image_url || "/placeholder.png"}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />

          {/* NAME & PRICE */}
          <div className="flex-1 ml-4">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">₹{item.price}</p>
          </div>

          {/* QTY CONTROLS */}
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 bg-gray-300 rounded"
              onClick={() => removeFromCart(item.id)}
            >
              −
            </button>

            <span>{item.qty}</span>

            <button
              className="px-3 py-1 bg-orange-500 text-white rounded"
              onClick={() => addToCart(item)}
            >
              +
            </button>
          </div>
        </div>
      ))}

      {/* TOTAL + PAYMENT */}
      <div className="bg-white shadow rounded-lg p-4 mt-4">
        <div className="flex justify-between font-bold text-xl mb-4">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="Cash">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
        >
          Place Order
        </button>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
}
