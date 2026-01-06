import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function FloatingCartButton() {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="fixed bottom-24 right-4 z-50
        bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white
        px-4 py-3 rounded-full shadow-xl
        flex items-center gap-2
        animate-bounce hover:scale-105 transition-transform"
    >
      🛒
      <span className="font-semibold">{totalItems}</span>
    </button>
  );
}
