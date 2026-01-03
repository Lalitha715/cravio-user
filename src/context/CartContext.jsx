// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === item.id && i.restaurant_id === item.restaurant_id
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.restaurant_id === item.restaurant_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 ,restaurant_name: item.restaurant_name, image_url: item.image_url}];
      }
    });
  };

  const removeFromCart = (id, restaurant_id) => {
    setCart((prev) =>
      prev.filter((i) => !(i.id === id && i.restaurant_id === restaurant_id))
    );
  };

  const updateQuantity = (id, restaurant_id, quantity) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.restaurant_id === restaurant_id
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
