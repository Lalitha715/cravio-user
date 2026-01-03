import { useEffect, useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import { fetchRestaurants, fetchAllDishes } from "../api/hasura"; // adjust api imports

export default function Search() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [dishes, setDishes] = useState([]);

  // Load all restaurants & dishes initially
  useEffect(() => {
    const loadData = async () => {
      const res = await fetchRestaurants();
      setRestaurants(res);

      const dishList = await fetchAllDishes(); // returns all dishes
      setDishes(dishList);
    };
    loadData();
  }, []);

  // Update suggestions on query change
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

    // Merge and limit to 10 suggestions
    setSuggestions([...dishMatches, ...restaurantMatches].slice(0, 10));
  }, [query, dishes, restaurants]);

  const handleSelect = (item) => {
    if (item.type === "dish") {
      // navigate to dish page or restaurant detail
      window.location.href = `/restaurant/${item.dish.restaurant_id}`;
    } else if (item.type === "restaurant") {
      window.location.href = `/restaurant/${item.restaurant.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-20">
      {/* Header fixed */}
      <Header className="fixed top-0 w-full z-10" />

      <div className="px-4 py-6 w-full max-w-md mx-auto flex flex-col z-0">
        <h1 className="text-2xl font-bold mb-4 text-center">Search</h1>

        <input
          type="text"
          placeholder="Search Restaurant or Dish"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {suggestions.length === 0 && query && (
          <p className="text-center text-gray-500 mt-2">No results found</p>
        )}

        {suggestions.length > 0 && (
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                className="flex-none w-32 bg-white rounded-lg shadow cursor-pointer p-2 hover:shadow-lg"
              >
                <div className="h-20 w-full bg-gray-200 rounded mb-2 flex items-center justify-center">
                  {item.type === "dish" && item.dish.image_url ? (
                    <img
                      src={item.dish.image_url}
                      alt={item.dish.name}
                      className="h-full w-full object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      {item.type === "restaurant" ? item.restaurant.name : "No Image"}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-center">
                  {item.type === "dish" ? item.dish.name : item.restaurant.name}
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
