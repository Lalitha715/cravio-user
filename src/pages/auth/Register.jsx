import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const INSERT_USER = gql`
  mutation InsertUser(
    $name: String!
    $email: String!
    $phone: String
  ) {
    insert_users_one(
      object: {
        name: $name
        email: $email
        phone: $phone
      }
    ) {
      id
      name
      email
    }
  }
`;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address,setAddress]=useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const [insertUser, { loading }] = useMutation(INSERT_USER);

  const handleRegister = async () => {
    if (!name || !email)
      return alert("Name & Email required");
    if (otp !== "1234")
      return alert("Invalid OTP");

    try {
      await insertUser({
        variables: {
          name,
          email,
          phone,
        },
      });

      alert("Registered successfully ✅");
      navigate("/home");
    } catch (err) {
      alert("Email already exists ❌");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Cravio
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Create your account
        </p>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-6 border rounded-lg px-4 py-3"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />

        <input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />

        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />

        <input
          placeholder="OTP (1234)"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full mt-4 border rounded-lg px-4 py-3"
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-center text-sm mt-4">
          Already registered?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
