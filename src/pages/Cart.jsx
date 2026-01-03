import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import {
  createOrder,
  insertOrderItems,
  createUser,
  getUserByPhone,
  clearUserCart,
} from "../api/hasura";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const userPhone = localStorage.getItem("userPhone");

  const increaseQty = (item) => {
    updateQuantity(item.id, item.restaurant_id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) return;
    updateQuantity(item.id, item.restaurant_id, item.quantity - 1);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleCheckout = async () => {
    try {
      if (!userPhone) {
        alert("Please login to continue checkout");
        return;
      }

      let user = await getUserByPhone(userPhone);
      if (!user) user = await createUser(userPhone);

      const order = await createOrder({
        user_id: user.id,
        total_amount: getTotal(),
        status: "pending",
      });

      const orderItems = cart.map((item) => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        price: item.price,
        restaurant_id: item.restaurant_id,
      }));

      await insertOrderItems(orderItems);
      await clearUserCart(user.id);
      clearCart();

      alert("Order placed successfully ✅");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen px-4 pt-24 pb-32">
        <h1 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-400">
            Your cart is empty 🛒
          </p>
        ) : (
          <div className="max-w-md mx-auto space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.restaurant_id}`}
                className="bg-white rounded-2xl shadow-md p-4 flex gap-4"
              >
                <img
                  src={item.image_url || "/dish-placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    ₹{item.price}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.restaurant_name}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 font-bold"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    removeFromCart(item.id, item.restaurant_id)
                  }
                  className="text-red-500 text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Total + Checkout */}
            <div className="bg-white rounded-2xl shadow-lg p-5 mt-6">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </>
  );
}
