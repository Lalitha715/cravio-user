import { useState, useEffect } from "react";
import { auth } from "../../services/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
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
    try {
      const appVerifier = window.recaptchaVerifier;
      const res = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(res);
    } catch (err) {
      alert(err.message);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmation.confirm(otp);

      // ✅ REQUIRED FIX (for checkout)
      localStorage.setItem("userPhone", phone);
      console.log("Saved phone:", phone);
      navigate("/home");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-96 shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button
          onClick={sendOtp}
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Send OTP
        </button>

        {confirmation && (
          <>
            <input
              className="border p-2 w-full mt-3"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white w-full p-2 mt-3 rounded"
            >
              Verify & Login
            </button>
          </>
        )}

        <p className="text-sm text-center mt-4">
          New user?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </p>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
