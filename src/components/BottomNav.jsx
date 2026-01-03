import React from "react";
import { NavLink } from "react-router-dom";
import {
  AiFillHome,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineProfile,
} from "react-icons/ai";
import { MdOutlineReceiptLong } from "react-icons/md";
import { useCart } from "../context/CartContext";

export default function BottomNav() {
  const { totalItems } = useCart();

  const linkClass =
    "relative flex flex-col items-center justify-center text-xs text-gray-500";
  const activeClass = "text-red-500";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
      <div className="flex justify-around h-14">
        <NavLink to="/home" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
          <AiFillHome size={22} />
          Home
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
          <AiOutlineSearch size={22} />
          Search
        </NavLink>

        {/* 🛒 Cart with Badge */}
        <NavLink to="/cart" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
          <div className="relative">
            <AiOutlineShoppingCart size={22} />

            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          Cart
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
          <MdOutlineReceiptLong size={22} />
          Orders
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => `${linkClass} ${isActive && activeClass}`}>
          <AiOutlineProfile size={22} />
          Profile
        </NavLink>
      </div>
    </div>
  );
}
