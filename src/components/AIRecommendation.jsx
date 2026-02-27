// src/components/AIRecommendations.jsx
import React, { useEffect, useState } from "react";

export default function AIRecommendations({ restaurantId }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/recommendations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item: `restaurant-${restaurantId}`, history: [] })
        });
        const data = await res.json();
        if (data.suggestions) setSuggestions(data.suggestions);
      } catch (err) {
        console.error("AI fetch error:", err);
      }
      setLoading(false);
    };
    fetchAI();
  }, [restaurantId]);

  if (loading) return <p className="text-sm text-gray-500">Loading AI suggestions...</p>;
  if (!suggestions.length) return null;

  return (
    <div className="mb-2 p-2 bg-yellow-50 rounded-md text-sm text-gray-700">
      <strong>AI Suggestions:</strong> {suggestions.join(", ")}
    </div>
  );
}