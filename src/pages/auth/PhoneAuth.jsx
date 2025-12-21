import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PhoneAuth() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (phone.length !== 10) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    // TEMP logic: check if new or existing user
    const isNewUser = phone.endsWith("0"); // demo logic, replace with Hasura check later

    localStorage.setItem("phone", phone);

    if (isNewUser) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Cravio
        </h1>
        <p className="text-gray-500 text-center mt-2">Login or Register</p>

        <input
          type="tel"
          placeholder="Enter mobile number"
          className="w-full mt-6 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-400"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={handleContinue}
          className="w-full mt-6 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default PhoneAuth;
