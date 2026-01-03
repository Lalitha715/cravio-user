// src/components/FoodCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function FoodCard({ dish, restaurantId, restaurantName }) {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const cartItem = cart.find(
    (item) => item.id === dish.id && item.restaurant_id === restaurantId
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image_url: dish.image_url,
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
    });
  };

  const handleMinus = () => {
    if (quantity > 1) {
      updateQuantity(dish.id, restaurantId, quantity - 1);
    } else {
      removeFromCart(dish.id, restaurantId);
    }
  };

  return (
    <div className="rounded-2xl p-[2px] bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 shadow-lg">
      <div className="bg-white rounded-2xl overflow-hidden">
        {/* Image */}
        <div className="relative group">
          <img
            src={dish.image_url || "/dish-placeholder.jpg"}
            alt={dish.name}
            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Price badge */}
          <span className="absolute top-2 right-2 bg-white/90 text-red-500 font-bold px-3 py-1 rounded-full text-sm shadow">
            ₹{dish.price}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 truncate">
            {dish.name}
          </h3>

          {/* Cart Actions */}
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Add to Cart
            </button>
          ) : (
            <div className="mt-4 flex items-center justify-between bg-gray-100 rounded-xl px-3 py-2">
              <button
                onClick={handleMinus}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-lg font-bold text-gray-700"
              >
                −
              </button>

              <span className="font-semibold text-gray-800">
                {quantity}
              </span>

              <button
                onClick={handleAdd}
                className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow text-lg font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

