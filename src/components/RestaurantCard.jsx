function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
    >
      <h3 className="text-lg font-bold">{restaurant.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{restaurant.address}</p>
    </div>
  );
}

export default RestaurantCard;
