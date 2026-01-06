// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { fetchRestaurants } from "../api/hasura";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import RestaurantCard from "../components/RestaurantCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("userName") || "";
    setUserName(name);

    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants 😕");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((res) =>
    res.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />

      <div className="min-h-screen px-4 py-20 pb-24">
        {/* Welcome Message */}
        {userName && (
          <h2 className="text-xl font-semibold mb-4 text-center text-green-600">
            Welcome, {userName} 👋
          </h2>
        )}

        {/* Title */}
        <h1 className="text-2xl font-extrabold mb-5 text-center bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Nearby Restaurants
        </h1>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 relative">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <span className="absolute right-4 top-3 text-gray-400">🔍</span>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-gray-400">Loading restaurants...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-center text-red-500 font-medium">{error}</p>
        )}

        {/* Restaurant List */}
        {!loading && !error && (
          <>
            {filteredRestaurants.length === 0 ? (
              <p className="text-center text-gray-400">
                No restaurants found 🍽️
              </p>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredRestaurants.map((res) => (
                  <RestaurantCard
                    key={res.id}
                    restaurant={res}
                    onClick={() => navigate(`/restaurant/${res.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </>
  );
}
