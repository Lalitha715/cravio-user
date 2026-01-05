import { useCart } from "../context/CartContext";
import BottomNav from "../components/BottomNav";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useCart(); // removed clearCart
  const navigate = useNavigate();

  const increaseQty = (item) => {
    updateQuantity(item.id, item.restaurant_id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) {
      removeFromCart(item.id, item.restaurant_id); // remove if 1 → 0
      return;
    }
    updateQuantity(item.id, item.restaurant_id, item.quantity - 1);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <>
      <Header />

      <div className="min-h-screen px-4 pt-24 pb-32">
        <h1 className="text-2xl font-extrabold text-center mb-6 bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-400 mt-20 space-y-4">
            <p className="text-lg">Your cart is empty 🛒</p>
            <button
              onClick={() => (window.location.href = "/home")}
              className="py-2 px-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Explore Restaurants
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-4">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.restaurant_id}`}
                className="bg-white rounded-2xl shadow-md p-4 flex gap-4 relative"
              >
                <img
                  src={item.image_url || "/dish-placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                      {item.name}
                      {item.is_veg ? (
                        <span className="inline-block w-3 h-3 bg-green-600 rounded-full"></span>
                      ) : (
                        <span className="inline-block w-3 h-3 bg-red-600 rounded-full"></span>
                      )}
                    </h2>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                    <p className="text-xs text-gray-400">{item.restaurant_name}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 font-bold text-lg flex items-center justify-center"
                    >
                      −
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      onClick={() => increaseQty(item)}
                      className="w-8 h-8 rounded-full bg-gray-100 font-bold text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.restaurant_id)}
                  className="absolute top-2 right-2 text-red-500 text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            ))}

            <div className="bg-white rounded-2xl shadow-lg p-5 mt-6 sticky bottom-4">
              <div className="flex justify-between font-semibold text-lg mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
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
