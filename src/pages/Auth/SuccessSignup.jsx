// src/pages/SuccessSignup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SuccessSignup() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/home");
        }, 2500); // 2.5 seconds

        return () => clearTimeout(timer);
    }, [navigate]);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            {/* Gradient Border */}
            <div className="p-[3px] rounded-3xl bg-gradient-to-r 
        from-pink-500 via-red-500 via-violet-500 via-blue-500 via-yellow-400 to-green-500">

                {/* White Card */}
                <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">

                    <h1 className="text-3xl font-bold text-orange-600 mb-4">
                        Cravio Welcome 😋
                    </h1>

                    <p className="text-lg font-semibold text-gray-800 mb-6">
                        Hurray! 🚀 Cravio is ready to serve your cravings!
                    </p>

                    {/* Taste tags */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm font-medium">
                        <span className="px-4 py-1 rounded-full bg-pink-100 text-pink-700">Sweet 🍬</span>
                        <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700">Sour 🍋</span>
                        <span className="px-4 py-1 rounded-full bg-red-100 text-red-700">Spicy 🌶️</span>
                        <span className="px-4 py-1 rounded-full bg-green-100 text-green-700">Bitter 🥬</span>
                        <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700">Salty 🧂</span>
                        <span className="px-4 py-1 rounded-full bg-violet-100 text-violet-700">Tasty 😍</span>
                    </div>

                    

                </div>
            </div>
        </div>
    );
}
