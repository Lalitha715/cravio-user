import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchDishesByRestaurant } from "../api/hasura";
import FoodCard from "../components/FoodCard";
import BottomNav from "../components/BottomNav";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDishes = async () => {
      const data = await fetchDishesByRestaurant(id);
      setDishes(data);
      setLoading(false);
    };
    loadDishes();
  }, [id]);

  if (loading) return <p className="p-4">Loading menu...</p>;

  return (
    <div className="p-4">
      <BottomNav/>
      <h1 className="text-xl font-bold mb-4">Menu</h1>

      {/* 🔥 GRID HERE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {dishes.map((dish) => (
          <FoodCard key={dish.id} dish={dish} src={dish.image} />
        ))}
      </div>
    </div>
  );
}
