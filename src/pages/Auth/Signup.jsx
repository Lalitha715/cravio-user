import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import client from "../../apolloClient"; // Apollo client
import { gql } from "@apollo/client";

export default function Signup() {
  const [name, setName] = useState(""); // ✅ New name field
  const [countryCode, setCountryCode] = useState("+91");
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  }, []);

  const sendOtp = async () => {
    if (!name.trim()) {
      alert("Enter your name");
      return;
    }

    if (number.length < 10) {
      alert("Enter valid mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await signInWithPhoneNumber(
        auth,
        `${countryCode}${number}`,
        window.recaptchaVerifier
      );
      setConfirmation(res);
      alert("OTP Sent 📲");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveUser = async (phone) => {
    const mutation = gql`
      mutation InsertUser($phone: String!, $name: String!) {
        insert_users_one(object: { phone: $phone, name: $name }) {
          id
          name
          phone
        }
      }
    `;

    try {
      await client.mutate({
        mutation,
        variables: { phone, name },
      });
      console.log("User saved to Hasura ✅");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const result = await confirmation.confirm(otp);
      const fullPhone = result.user.phoneNumber;

      // Store phone locally
      localStorage.setItem("userPhone", fullPhone);

      // Save user in Hasura
      await saveUser(fullPhone);

      navigate("/signup-success", { state: { type: "signup" } });
    } catch {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="relative w-96 p-[2px] rounded-2xl bg-gradient-to-br 
        from-blue-500 via-green-400 via-violet-500 via-orange-400 via-pink-400 to-red-500 shadow-2xl">

        <div className="bg-white rounded-2xl p-8">
          <h2 className="text-2xl font-extrabold text-center text-orange-500">
            Create Account
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Sign up with your mobile number
          </p>

          {/* Name Input */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-lg px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* Phone input */}
          <div className="flex gap-2 mb-4">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="border rounded-lg px-2 py-2 bg-gray-100 text-sm font-medium"
            >
              <option value="+91">IN +91</option>
              <option value="+1">US +1</option>
              <option value="+44">UK +44</option>
            </select>

            <input
              type="tel"
              placeholder="Mobile number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 
              text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

          {confirmation && (
            <>
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="border p-2 w-full mt-4 rounded-lg text-center tracking-widest 
                  focus:ring-2 focus:ring-green-400 outline-none"
              />

              <button
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-500 
                  text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                {loading ? "Verifying..." : "Verify & Signup"}
              </button>
            </>
          )}

          <p className="text-sm text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-red-500 font-semibold">
              Login
            </Link>
          </p>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
}
