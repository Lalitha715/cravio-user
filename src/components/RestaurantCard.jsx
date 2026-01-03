// src/components/RestaurantCard.jsx
import React from "react";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer w-full max-w-xs mx-auto"
      onClick={onClick}
    >
      {/* Square image container */}
      <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-t-xl bg-gray-100">
        <img
          src={restaurant.image_url || "/restaurant.jpg"}
          alt={restaurant.name}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Info section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{restaurant.name}</h2>
        <p className="text-gray-600 text-sm">{restaurant.address}</p>

        <div className="mt-2 flex justify-between items-center">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
            ⭐ {restaurant.hygiene_rating || "N/A"}
          </span>
          <span className="text-sm text-red-500 font-semibold">View Menu →</span>
        </div>
      </div>
    </div>
  );
}
