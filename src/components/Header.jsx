import React from "react";
import logo from "../assets/logo_cravio.png";
export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50">
      <div className="h-full bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 shadow-lg flex items-center justify-between px-6">

        {/* Brand + Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={logo}
            alt="Cravio Logo"
            className="h-12 w-12 object-contain rounded-lg border-2 border-white"
          />
          <h1 className="text-xl font-extrabold text-white tracking-wide">
            Cravio
          </h1>
        </div>

        {/* Tagline */}
        <span className="text-sm text-white/90 font-medium">
          Multi-Restaurant Food, One Tap Happiness 🤩🥳
        </span>

      </div>
    </header>
  );
}
