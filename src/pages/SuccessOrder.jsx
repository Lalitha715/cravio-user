// src/pages/SuccessOrder.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Confetti from "react-confetti";

export default function SuccessOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showConfetti, setShowConfetti] = useState(true);
  const audioRef = useRef(null);
  const id = location.state?.id||"test123";

  useEffect(() => {
    // 🔊 MP3 sound (Option 2)
    audioRef.current = new Audio("/ordersuccess.mp3");
    audioRef.current.volume = 0.6;

    // Try autoplay
    audioRef.current
      .play()
      .catch(() => {
        console.log("Autoplay blocked by browser");
      });
    if (!id) {
      console.log("Order Id is missing");
      return;
    }
    const timer = setTimeout(() => {
      setShowConfetti(false);
      navigate(`/track-order/${id}`, { replace: true });
    }, 4000);

    return () => {
      clearTimeout(timer);
      audioRef.current && audioRef.current.pause();
    };
  }, [navigate,id]);

  return (
    <>
      <Header />

      {showConfetti && (
        <Confetti
          recycle={false}
          numberOfPieces={300}
          gravity={0.3}
        />
      )}

      <div className="min-h-screen flex flex-col justify-center items-center px-4 pt-24 pb-32 bg-gradient-to-b from-yellow-50 via-yellow-100 to-yellow-50">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border-4 border-orange-200 animate-pulse">

          <div className="mx-auto w-28 h-28 mb-4">
            <svg
              className="w-28 h-28 text-orange-500 animate-bounce"
              viewBox="0 0 52 52"
            >
              <circle cx="26" cy="26" r="25" fill="none" strokeWidth="2" />
              <path fill="none" strokeWidth="4" d="M14 27l7 7 17-17" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold mb-2 text-orange-600">
            Order Placed 🎉
          </h1>

          <p className="text-gray-700 mb-4">
            Your order has been successfully placed! <br />
            Your craving food is on the way!! 🍛🍲🍕
          </p>

          <button
            onClick={() => navigate("/orders")}
            className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            View Orders
          </button>
        </div>
      </div>

      <BottomNav />
    </>
  );
}


