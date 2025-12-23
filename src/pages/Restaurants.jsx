import React, { useEffect, useState } from "react";
import { fetchRestaurants } from "../api/hasura";
import { useNavigate } from "react-router-dom";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants().then(setRestaurants);
  }, []);

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-bold mb-4">Restaurants</h2>

      <div className="grid grid-cols-1 gap-4">
        {restaurants.map((res) => (
          <div
            key={res.id}
            onClick={() => navigate(`/restaurant/${res.id}`)}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md"
          >
            <h3 className="text-lg font-semibold">{res.name}</h3>
            <p className="text-sm text-gray-500">{res.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
