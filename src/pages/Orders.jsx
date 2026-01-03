import { useEffect, useState } from "react";
import { getUserByPhone, fetchUserOrders } from "../api/hasura";
import Header from "../components/Header";
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

        // Group items by restaurant
        const formattedOrders = (userOrders || []).map((order) => {
          const restaurantMap = {};
          order.items.forEach((item) => {
            const rid = item.restaurant.id;
            if (!restaurantMap[rid]) {
              restaurantMap[rid] = {
                restaurant: item.restaurant,
                items: [],
              };
            }
            restaurantMap[rid].items.push(item);
          });
          return {
            ...order,
            groupedItems: Object.values(restaurantMap),
          };
        });

        setOrders(formattedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col items-center pt-20 px-4 w-full">
        <h1 className="text-2xl font-extrabold mb-6 text-red-500">
          My Orders
        </h1>

        {loading ? (
          <p className="text-gray-500 text-lg">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-lg">No orders yet</p>
        ) : (
          <div className="w-full max-w-md flex flex-col gap-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl p-[2px] bg-gradient-to-br from-pink-500 via-orange-400 to-red-500 shadow-lg"
              >
                <div className="bg-white rounded-2xl p-4 flex flex-col gap-3">
                  {/* Order Header */}
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">
                      Order #{order.order_number}
                    </span>

                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Order Total */}
                  <div className="flex justify-between font-semibold text-gray-700">
                    <span>Total</span>
                    <span className="text-red-500">
                      ₹{order.total_amount}
                    </span>
                  </div>

                  {/* Restaurants */}
                  {order.groupedItems.map((group) => (
                    <div
                      key={group.restaurant.id}
                      className="mt-3 border-t pt-3 flex flex-col gap-2"
                    >
                      <h3 className="font-semibold text-indigo-600">
                        {group.restaurant.name}
                      </h3>

                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm"
                        >
                          <span className="text-gray-700">
                            {item.dish.name} × {item.quantity}
                          </span>
                          <span className="font-medium text-gray-800">
                            ₹{item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      
    </div>
  );
}
