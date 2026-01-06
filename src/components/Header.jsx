import React from "react";
import logo from "../assets/logo_cravio.png";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-16 bg-gradient-to-r from-pink-500 via-orange-400 to-red-500 shadow-md flex items-center justify-between px-4 md:px-8">

        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-3">
          <img
            src={logo}
            alt="Cravio Logo"
            className="h-10 w-10 object-contain rounded-md border border-white bg-white"
          />
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">
            Cravio
          </h1>
        </div>

        {/* Right: Tagline (Mobile + Desktop) */}
        <div className="text-right">
          <p className="text-sm font-medium text-white leading-tight">
            Multi-Restaurant Food
          </p>
          <p className="text-xs text-white/90">
            One Tap Happiness 🤩🥳
          </p>
        </div>

      </div>
    </header>
  );
}
