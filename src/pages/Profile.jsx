import { useEffect, useState } from "react";
import { getUserByPhone, getUserAddress } from "../api/hasura";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const rawPhone = localStorage.getItem("userPhone");
      if (!rawPhone) return setLoading(false);

      const phone = rawPhone.replace(/\s+/g, "");
      const u = await getUserByPhone(phone);
      if (!u) return setLoading(false);

      setUser(u);
      const addr = await getUserAddress(u.id);
      setAddress(addr || null);
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex justify-center items-start pt-24 px-4">
        {/* Gradient Border Card */}
        <div className="w-full max-w-md rounded-3xl p-[2px] bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 shadow-lg">
          <div className="bg-white rounded-3xl px-6 py-7">
            <h1 className="text-2xl font-extrabold text-center text-red-500 mb-6">
              My Profile
            </h1>

            {/* Name */}
            <div className="mb-5">
              <p className="text-xs font-medium text-gray-400 tracking-widest">
                NAME
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.name || "User"}
              </p>
            </div>

            {/* Phone */}
            <div className="mb-5">
              <p className="text-xs font-medium text-gray-400 tracking-widest">
                PHONE
              </p>
              <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.phone}
              </p>
            </div>

            {/* Address */}
            <div className="mb-7">
              <p className="text-xs font-medium text-gray-400 tracking-widest">
                ADDRESS
              </p>

              {address ? (
                <p className="mt-2 text-gray-700 leading-relaxed text-sm">
                  {address.address_line}
                  <br />
                  {[address.city, address.state, address.pincode]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              ) : (
                <p className="mt-2 text-sm text-gray-400">
                  No address added
                </p>
              )}
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                localStorage.removeItem("userPhone");
                window.location.href = "/login";
              }}
              className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
      
    </div>
  );
}
