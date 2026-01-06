// src/pages/RestaurantMenu.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDishesByRestaurant } from "../api/hasura";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FoodCard from "../components/FoodCard";
import FloatingCartButton from "../components/CartButton";
import { IoArrowBack } from "react-icons/io5";

export default function RestaurantMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [foodType, setFoodType] = useState("All"); // All | Veg | Non-Veg

  useEffect(() => {
    const loadMenu = async () => {
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

    loadMenu();
  }, [id]);

  // Cuisine list
  const cuisines = useMemo(() => {
    const list = dishes.map((d) => d.cuisine).filter(Boolean);
    return ["All", ...new Set(list)];
  }, [dishes]);

  // Filtered Dishes
  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      const matchSearch = dish.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCuisine =
        cuisine === "All" || dish.cuisine === cuisine;

      const matchFoodType =
        foodType === "All" ||
        (foodType === "Veg" && dish.is_veg === true) ||
        (foodType === "Non-Veg" && dish.is_veg === false);

      return matchSearch && matchCuisine && matchFoodType;
    });
  }, [dishes, search, cuisine, foodType]);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 pt-20 pb-28 px-4">

        {/* Back + Restaurant Name */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2
             px-3 py-2 rounded-xl
             bg-green-50 text-pink-800
             font-bold text-lg
             border border-pink-200
             hover:bg-pink-100 transition"
          >
           <IoArrowBack size={26} />
          </button>

          <h1 className="text-2xl font-bold">
            {restaurant?.name || "Menu"}
          </h1>
        </div>

        {/* Sticky Filters */}
        <div className="sticky top-[72px] z-20 bg-gray-100 pb-4">
          <div className="flex flex-col gap-3">

            {/* Search */}
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Filters Row */}
            <div className="flex gap-3 flex-wrap items-center">

              {/* Cuisine */}
              <select
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="px-3 py-2 rounded-lg border bg-white"
              >
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Food Type Toggle: All / Veg / Non-Veg */}
              <div className="flex gap-2">
                {["All", "Veg", "Non-Veg"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFoodType(type)}
                    className={`px-3 py-2 rounded-lg font-semibold transition
                      ${
                        foodType === type
                          ? "bg-orange-600 text-white"
                          : "bg-white border text-gray-700"
                      }`}
                  >
                    {type === "Veg"
                      ? "🌱 Veg"
                      : type === "Non-Veg"
                      ? "🥩 Non-Veg"
                      : "All"}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Content */}
        {loading && <p className="mt-6">Loading dishes...</p>}
        {error && <p className="text-red-500 mt-6">{error}</p>}

        {!loading && filteredDishes.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No dishes found 😕
          </p>
        )}

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {filteredDishes.map((dish) => (
            <FoodCard
              key={dish.id}
              dish={dish}
              restaurantId={restaurant?.id}
              restaurantName={restaurant?.name}
            />
          ))}
        </div>
      </div>
      <FloatingCartButton/>
      <BottomNav />
    </>
  );
}
