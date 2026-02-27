// src/pages/AI.jsx
import React, { useState } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function AI() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/ai/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: input, history: [] })
      });

      const data = await res.json();
      if (data.suggestions) {
        setHistory(prev => [...prev, { query: input, response: data.suggestions }]);
        setInput("");
      }
    } catch (err) {
      console.error("AI request failed:", err);
      alert("Failed to fetch AI suggestions");
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen px-4 pt-24 pb-32 max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">AI Food Suggestions</h1>
        <form onSubmit={handleAskAI} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Type a dish or ingredient..."
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-lg"
          />
          <button type="submit" className="bg-orange-500 text-white px-4 rounded-lg">Ask</button>
        </form>

        {loading && <p>Loading AI suggestions...</p>}

        <div className="space-y-3 mt-4">
          {history.map((h, i) => (
            <div key={i} className="bg-white shadow-md p-3 rounded-lg">
              <p className="font-semibold">You: {h.query}</p>
              <p className="text-gray-700 mt-1">AI: {h.response.join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  );
}