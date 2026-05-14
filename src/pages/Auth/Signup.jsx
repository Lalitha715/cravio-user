// src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUserByEmail } from "../../api/hasura";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("Please fill all fields");
    }

    try {
      const existing = await getUserByEmail(email);
      if (existing) {
        return alert("User already exists");
      }
      const newUser = await createUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      // ✅ store
      localStorage.setItem("userId", newUser.id);
      localStorage.setItem("userEmail", email);

      alert("Signup successful!");
      navigate("/signup-success");
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F5] px-4">
      <div className="w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-br from-red-500 via-orange-400 to-green-500 shadow-xl">
        <div className="bg-white rounded-3xl px-6 py-8">

          <div className="text-center text-4xl mb-3">🍜🍔🍹</div>

          <h1 className="text-3xl font-extrabold text-center text-red-500 mb-6">
            Create Account 🍽️
          </h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Enter Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Enter Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-orange-400 hover:opacity-90 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              className="text-red-500 font-semibold cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}