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

  /* ======================
     Quantity handlers
  ====================== */
  const increaseQty = (item) => {
    updateQuantity(item.id, item.restaurant_id, item.quantity + 1);
  };

  const decreaseQty = (item) => {
    if (item.quantity === 1) return;
    updateQuantity(item.id, item.restaurant_id, item.quantity - 1);
  };

  /* ======================
     Total amount
  ====================== */
  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  /* ======================
     Checkout handler
  ====================== */
  const handleCheckout = async () => {
    try {
      if (!userPhone) { 
        alert("Please login to continue checkout");
        return;
      }

      /* 1️⃣ Get or create user */
      let user = await getUserByPhone(userPhone);
      if (!user) {
        user = await createUser(userPhone);
      }

      /* 2️⃣ Create order */
      const order = await createOrder({
        user_id: user.id,
        total_amount: getTotal(),
        status: "pending",
      });

      /* 3️⃣ Prepare order items (multi-restaurant safe) */
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        dish_id: item.id,
        quantity: item.quantity,
        price: item.price,
        restaurant_id: item.restaurant_id,
      }));

      /* 4️⃣ Insert order items */
      await insertOrderItems(orderItems);

      /* 5️⃣ Clear cart (DB + local) */
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

      <div className="min-h-screen bg-gray-100 px-4 py-20 pb-28">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.restaurant_id}`}
                className="bg-white rounded-xl p-4 mb-4 flex justify-between items-center"
              >
                <img
                  src={item.image_url || "/dish-placeholder.jpg"}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1 mx-4">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                  <p className="text-xs text-gray-400">
                    {item.restaurant_name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => decreaseQty(item)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>

                  <button
                    onClick={() =>
                      removeFromCart(item.id, item.restaurant_id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-white p-4 rounded-xl">
              <div className="flex justify-between font-semibold mb-4">
                <span>Total</span>
                <span>₹{getTotal()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-red-500 text-white py-3 rounded-lg"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </>
  );
}
