// src/components/RestaurantCard.jsx
import React from "react";

/* =========================
   HELPERS
========================= */

const parseTime = (time) => {
  if (!time) return null;
  const clean = time.split("+")[0]; // remove timezone
  const [h, m] = clean.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
};

const formatTime = (time) => {
  if (!time) return "-";
  const d = parseTime(time);
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default function RestaurantCard({ restaurant, onClick }) {

  const isOpenNow = () => {
    if (!restaurant.open_time || !restaurant.close_time) return true;

    const now = new Date();
    const [openH, openM] = restaurant.open_time.split(":").map(Number);
    const [closeH, closeM] = restaurant.close_time.split(":").map(Number);

    const openTime = new Date();
    openTime.setHours(openH, openM, 0, 0);

    const closeTime = new Date();
    closeTime.setHours(closeH, closeM, 0, 0);

    if (!openTime || !closeTime) return true;

  

    return now >= openTime && now <= closeTime;
  };

  const open = isOpenNow();

  return (
    <div
      onClick={open ? onClick : undefined}
      className={`rounded-2xl p-[2px] shadow-lg transition-transform
        ${open
          ? "bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 cursor-pointer hover:scale-[1.02]"
          : "bg-gray-300 cursor-not-allowed opacity-80"
        }`}
    >
      <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full">

        {/* Image */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          <img
            src={restaurant.image_url || "/restaurant.jpg"}
            alt={restaurant.name}
            className={`w-full h-full object-cover ${open ? "" : "grayscale"}`}
          />

          {/* Status */}
          <span
            className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow
              ${open
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {open ? "Open Now" : "Closed"}
          </span>

          {/* Rating */}
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
              🕒 {formatTime(restaurant.open_time)} – {formatTime(restaurant.close_time)}
            </span>

            <span
              className={`text-sm font-semibold ${open ? "text-red-500" : "text-gray-400"
                }`}
            >
              {open ? "View Menu →" : "Unavailable"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
