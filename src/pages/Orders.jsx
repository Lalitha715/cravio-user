import { useEffect, useState } from "react";
import { getUserByPhone, fetchUserOrders } from "../api/hasura";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const rawPhone = localStorage.getItem("userPhone");
      if (!rawPhone) return setLoading(false);

      const phone = rawPhone.replace(/\s+/g, "");
      const user = await getUserByPhone(phone);
      if (!user) return setLoading(false);

      try {
        const userOrders = await fetchUserOrders(user.id);
        setOrders(userOrders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header className="z-10 relative" />

      <div className="flex-1 flex flex-col items-center pt-20 px-4">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-lg">No orders yet</p>
        ) : (
          <div className="w-full max-w-md flex flex-col gap-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 relative z-0"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Order #{order.order_number}</span>
                  <span className="text-sm text-gray-500">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>₹{order.total_amount}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Placed on: {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <Footer />
    </div>
  );
}
