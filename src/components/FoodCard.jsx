import { useCart } from "../context/CartContext";

function FoodCard({ item }) {
  const { addItem } = useCart();

  return (
    <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center mb-2">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">₹{item.price}</p>
      </div>
      <button
        onClick={() => addItem(item)}
        className="bg-orange-500 text-white px-4 py-1 rounded-lg hover:bg-orange-600"
      >
        ADD
      </button>
    </div>
  );
}

export default FoodCard;
