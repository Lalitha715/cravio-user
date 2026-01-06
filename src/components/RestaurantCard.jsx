// src/components/RestaurantCard.jsx
import React from "react";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-[2px] bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
    >
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full">
        {/* Image */}
        <div className="relative group h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <img
            src={restaurant.image_url || "/restaurant.jpg"}
            alt={restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Rating badge */}
          <span className="absolute top-3 right-3 bg-white/90 text-green-600 text-xs font-bold px-3 py-1 rounded-full shadow">
            ⭐ {restaurant.hygiene_rating ?? 0}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <h2 className="text-lg font-bold text-gray-800 truncate">
              {restaurant.name}
            </h2>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {restaurant.address ?? "No address"}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Open Now
            </span>
            <span className="text-sm font-semibold text-red-500">
              View Menu →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
