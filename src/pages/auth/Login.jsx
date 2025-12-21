import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useLazyQuery } from "@apollo/client";

// Hasura query to get user by email
const LOGIN_QUERY = gql`
  query LoginUser($email: String!) {
    users(where: { email: { _eq: $email }, is_active: { _eq: true } }) {
      id
      name
      email
      role
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_QUERY, {
    onCompleted: (data) => {
      if (!data.users || data.users.length === 0) {
        alert("User not found ❌");
      } else {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(data.users[0]));
        navigate("/home");
      }
    },
    onError: (err) => {
      console.error(err);
      alert("Something went wrong ❌");
    },
    fetchPolicy: "no-cache", // so it always fetches fresh data
  });

  const handleLogin = () => {
    if (!email) return alert("Enter your email");
    loginUser({ variables: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Cravio
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Login to your account
        </p>

        {/* Email input */}
        <input
          type="text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-6 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-orange-500 cursor-pointer font-medium"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
