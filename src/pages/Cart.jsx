import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-3"
        >
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              ₹{item.price} × {item.qty}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 font-semibold"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="bg-white p-4 rounded-xl shadow mt-4">
        <h2 className="font-semibold">Total: ₹{total}</h2>

        <button
          onClick={clearCart}
          className="w-full mt-3 bg-orange-500 text-white py-3 rounded-lg"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
