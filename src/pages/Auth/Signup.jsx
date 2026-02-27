import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import client from "../../apolloClient";
import { gql } from "@apollo/client";
import toast from "react-hot-toast";
 
export default function Signup() {
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  // ✅ Setup Recaptcha (Correct v9 format)
  useEffect(() => {
    if (!auth) {
      console.log("Auth undefined ❌");
      return;
    }
 
    if (window.recaptchaVerifier) return;
 
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
  }, []);
 
  // ✅ Send OTP
  const sendOtp = async () => {
    if (!name.trim()) {
      toast.error("Enter your name");
      return;
    }
 
    if (number.length !== 10) {
      toast.error("Enter valid mobile number");
      return;
    }
 
    try {
      setLoading(true);
      toast.loading("Sending OTP...");
 
      const appVerifier = window.recaptchaVerifier;
 
      const result = await signInWithPhoneNumber(
        auth,
        `${countryCode}${number}`,
        appVerifier
      );
 
      setConfirmation(result);
 
      toast.dismiss();
      toast.success("OTP Sent Successfully 📲");
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
 
  // ✅ Save user to Hasura
  const saveUser = async (phone) => {
    const mutation = gql`
      mutation InsertUser($phone: String!, $name: String!) {
        insert_users_one(object: { phone: $phone, name: $name }) {
          id
        }
      }
    `;
 
    try {
      await client.mutate({
        mutation,
        variables: { phone, name },
      });
      console.log("User saved ✅");
    } catch (err) {
      console.log("Hasura error:", err);
    }
  };
 
  // ✅ Verify OTP
  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }
 
    try {
      setLoading(true);
      toast.loading("Verifying OTP...");
 
      const result = await confirmation.confirm(otp);
 
      const fullPhone = result.user.phoneNumber;
 
      localStorage.setItem("userPhone", fullPhone);
 
      await saveUser(fullPhone);
 
      toast.dismiss();
      toast.success("Signup Successful 🎉");
 
      navigate("/signup-success");
    } catch (error) {
      toast.dismiss();
      toast.error("Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-96 p-8 bg-white rounded-2xl shadow-xl">
 
        <h2 className="text-2xl font-bold text-center mb-4">
          Create Account
        </h2>
 
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
        />
 
        <div className="flex gap-2 mb-3">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="+91">IN +91</option>
            <option value="+1">US +1</option>
          </select>
 
          <input
            type="tel"
            placeholder="Mobile number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="border flex-1 p-2 rounded"
          />
        </div>
 
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-2 rounded"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
 
        {confirmation && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="border w-full p-2 mt-4 rounded text-center"
            />
 
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-3 bg-green-500 text-white p-2 rounded"
            >
              {loading ? "Verifying..." : "Verify & Signup"}
            </button>
          </>
        )}
 
        <p className="text-sm text-center mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
 
        {/* Recaptcha container */}
        <div id="recaptcha-container"></div>
 
      </div>
    </div>
  );
}
 