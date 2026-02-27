// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage safely
  const [cart, setCart] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("cart")) || [];
    // Ensure every item has restaurant_name and image_url
    return saved.map(item => ({
      ...item,
      restaurant_name: item.restaurant_name || (item.restaurant?.name || "Restaurant"),
      image_url: item.image_url || "/dish-placeholder.jpg",
    }));
  });

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Total number of items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add item to cart
  const addToCart = (item, restaurant) => {
    // restaurant object optional fallback
    const restaurantName = restaurant?.name || item.restaurant_name || "Restaurant";
    const restaurantId = restaurant?.id || item.restaurant_id || null;

    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.restaurant_id === restaurantId
      );

      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.restaurant_id === restaurantId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [
          ...prev,
          {
            ...item,
            quantity: 1,
            restaurant_id: restaurantId,
            restaurant_name: restaurantName,
            image_url: item.image_url || "/dish-placeholder.jpg",
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id, restaurant_id) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.restaurant_id === restaurant_id))
    );
  };

  // Update item quantity
  const updateQuantity = (id, restaurant_id, quantity) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.restaurant_id === restaurant_id
          ? { ...i, quantity }
          : i
      )
    );
  };

  // Clear entire cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);