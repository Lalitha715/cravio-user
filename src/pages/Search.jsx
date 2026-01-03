import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { fetchRestaurants, fetchAllDishes } from "../api/hasura";

export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchRestaurants();
      setRestaurants(res || []);

      const dishList = await fetchAllDishes();
      setDishes(dishList || []);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = query.toLowerCase();

    const dishMatches = dishes
      .filter((d) => d.name.toLowerCase().includes(lower))
      .map((d) => ({ type: "dish", dish: d }));

    const restaurantMatches = restaurants
      .filter((r) => r.name.toLowerCase().includes(lower))
      .map((r) => ({ type: "restaurant", restaurant: r }));

    setSuggestions([...dishMatches, ...restaurantMatches].slice(0, 10));
  }, [query, dishes, restaurants]);

  const handleSelect = (item) => {
    if (item.type === "dish") {
      window.location.href = `/restaurant/${item.dish.restaurant_id}`;
    } else {
      window.location.href = `/restaurant/${item.restaurant.id}`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <Header className="fixed top-0 w-full z-10" />

      <div className="px-4 py-6 w-full max-w-md mx-auto">
        {/* Title */}
        <h1 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Search
        </h1>

        {/* Search box */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search restaurants or dishes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          <span className="absolute right-4 top-3 text-gray-400">🔍</span>
        </div>

        {/* Empty state */}
        {suggestions.length === 0 && query && (
          <p className="text-center text-gray-400">
            No results found 😕
          </p>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex overflow-x-auto gap-4 pb-4">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className="flex-none w-36 bg-white rounded-2xl shadow-md p-2 cursor-pointer hover:shadow-lg transition"
              >
                <div className="h-24 w-full rounded-xl overflow-hidden bg-gray-100 mb-2">
                  {item.type === "dish" && item.dish.image_url ? (
                    <img
                      src={item.dish.image_url}
                      alt={item.dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 text-center px-2">
                      {item.type === "restaurant"
                        ? item.restaurant.name
                        : "No Image"}
                    </div>
                  )}
                </div>

                <p className="text-sm font-semibold text-center truncate">
                  {item.type === "dish"
                    ? item.dish.name
                    : item.restaurant.name}
                </p>

                <p
                  className={`text-xs text-center mt-1 ${
                    item.type === "dish"
                      ? "text-pink-500"
                      : "text-indigo-500"
                  }`}
                >
                  {item.type === "dish" ? "Dish" : "Restaurant"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
