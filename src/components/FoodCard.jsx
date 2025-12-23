import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function FoodCard({ dish }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image_url: dish.image_url, // 🔥 use image_url
      restaurant_id: dish.restaurant_id,
    });

    // Show toast notification
    toast.success("Your dish added to cart", {
      duration: 2000,
      position: "top-right",
      onClick: () => navigate("/cart"),
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-3 flex flex-col sm:flex-row items-center gap-4 hover:shadow-lg transition">
      {/* IMAGE */}
      <img
        src={dish.image_url || "/placeholder.png"}
        alt={dish.name}
        className="w-24 h-24 object-cover rounded-lg"
      />

      {/* NAME & PRICE */}
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg">{dish.name}</h3>
        <p className="text-gray-600 mt-1">₹{dish.price}</p>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={handleAddToCart}
        className="px-4 py-2 bg-orange-500 text-white font-semibold rounded hover:bg-orange-600 transition"
      >
        Add
      </button>
    </div>
  );
}
