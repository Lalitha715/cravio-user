// src/pages/RestaurantMenu.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDishesByRestaurant } from "../api/hasura";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FoodCard from "../components/FoodCard";

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔍 Search & Filter states
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchDishesByRestaurant(id);

        setRestaurant({
          id: data.id,
          name: data.name,
        });

        setDishes(data.dishes || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    loadDishes();
  }, [id]);

  // 🧠 Filter logic
  const filteredDishes = dishes.filter((dish) => {
    const matchesSearch = dish.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesCuisine =
      cuisine === "All" || dish.cuisine === cuisine;

    return matchesSearch && matchesCuisine;
  });

  // 🧠 Get unique cuisines
  const cuisines = [
    "All",
    ...new Set(dishes.map((d) => d.cuisine).filter(Boolean)),
  ];

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 px-4 py-20 pb-24">

        {/* 🔙 Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 font-semibold mb-3"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-bold mb-4">
          {restaurant?.name || "Menu"}
        </h1>

        {/* 🔍 Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search dish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {cuisines.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading && <p>Loading dishes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {filteredDishes.length === 0 && !loading && (
          <p className="text-gray-500">No dishes found 😕</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              dish={dish}
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </>
  );
}
