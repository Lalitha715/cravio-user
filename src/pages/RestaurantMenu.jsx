// src/pages/RestaurantMenu.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDishesByRestaurant } from "../api/hasura";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import FoodCard from "../components/FoodCard";

export default function RestaurantMenu() {
  const { id } = useParams(); // restaurant id from URL

  const [dishes, setDishes] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDishes = async () => {
      try {
        const data = await fetchDishesByRestaurant(id);

        // restaurant info
        setRestaurant({
          id: data.id,
          name: data.name,
        });

        // dishes list
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

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-100 px-4 py-20 pb-24">
        <h1 className="text-2xl font-bold mb-4">
          {restaurant?.name || "Menu"}
        </h1>

        {loading && <p>Loading dishes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dishes.map((dish) => (
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
