import { useEffect, useState } from "react";
import { getUserByPhone } from "../api/hasura";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const rawPhone = localStorage.getItem("userPhone");
      if (!rawPhone) return;

      const phone = rawPhone.replace(/\s+/g, ""); // normalize
      const u = await getUserByPhone(phone);
      setUser(u);
    };

    loadUser();
  }, []);

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center justify-start pt-20 px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-md z- 2 relative"> 
          <h1 className="text-2xl font-bold mb-6 text-center">My Profile</h1>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-500 text-sm mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={user.name || "Temp User"}
              className="w-full border rounded p-2 bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-500 text-sm mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="text"
              value={user.phone}
              className="w-full border rounded p-2 bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-6">
            <label htmlFor="role" className="block text-gray-500 text-sm mb-1">
              Role
            </label>
            <input
              id="role"
              type="text"
              value={user.role || "TEMP"}
              className="w-full border rounded p-2 bg-gray-50"
              disabled
            />
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("userPhone");
              window.location.href = "/login"; // redirect after logout
            }}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <BottomNav />
      <Footer />
    </div>
  );
}
