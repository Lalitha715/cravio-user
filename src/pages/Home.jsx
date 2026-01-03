// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { fetchRestaurants } from "../api/hasura";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import RestaurantCard from "../components/RestaurantCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await fetchRestaurants();
        setRestaurants(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter((res) =>
    res.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 px-4 py-20 pb-24">
        <h1 className="text-2xl font-bold mb-4">Nearby Restaurants</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-red-300"
        />

        {loading && <p>Loading restaurants...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredRestaurants.map((res) => (
            <RestaurantCard
              key={res.id}
              restaurant={res}
              onClick={() => navigate(`/restaurant/${res.id}`)}
            />
          ))}
        </div>
      </div>

      <BottomNav />
      <Footer />
    </>
  );
}
