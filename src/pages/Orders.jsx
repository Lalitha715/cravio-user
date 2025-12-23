// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { fetchUserOrders } from "../api/hasura"; // your API
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import BottomNav from "../components/BottomNav";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?.id) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const data = await fetchUserOrders(user.id);
        setOrders(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch orders");
      }
    };

    getOrders();
  }, [navigate]);

  if (!orders.length) {
    <div className="p-6 text-center text-gray-500 text-lg">
      <p>You have no orders yet.</p>
      <BottomNav/>
    </div>
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const items =
            typeof order.items === "string" ? JSON.parse(order.items) : order.items;

          return (
            
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Order #</span>
                <span className="text-gray-900 font-medium">{order.order_number}</span>
              </div>

              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">Status</span>
                <span
                  className={`font-semibold px-2 py-1 rounded text-sm ${
                    order.status === "PLACED"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "DELIVERED"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-3">
                <span className="font-semibold text-gray-700">Payment:</span>{" "}
                <span className="text-gray-900">{order.payment_method || "Not specified"}</span>
              </div>

              <div className="mb-4">
                <span className="font-semibold text-gray-700">Items:</span>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  {items?.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.qty} - ₹{item.price * item.qty}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-3">
                <span>Total:</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <BottomNav />
      </div>
    </div>
  );
}
