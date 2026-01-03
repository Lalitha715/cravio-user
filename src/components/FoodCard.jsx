// src/components/FoodCard.jsx
import React from "react";
import { useCart } from "../context/CartContext";

export default function FoodCard({ dish, restaurantId, restaurantName }) {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const cartItem = cart.find(
    (item) =>
      item.id === dish.id && item.restaurant_id === restaurantId
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
    <div className="bg-white rounded-xl shadow p-4">
      <img
        src={dish.image_url || "/dish-placeholder.jpg"}
        alt={dish.name}
        className="w-full h-40 object-cover rounded"
      />

      <h3 className="mt-2 font-semibold">{dish.name}</h3>
      <p className="text-red-500">₹{dish.price}</p>

      {quantity === 0 ? (
        <button
          onClick={handleAdd}
          className="mt-2 w-full bg-red-500 text-white py-2 rounded"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handleMinus}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            −
          </button>
          <span>{quantity}</span>
          <button
            onClick={handleAdd}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
