import MapRoute from "../components/MapRoute";

export default function RestaurantTrack() {

  const restaurant = {
    name: "A2B Restaurant",
    lat: 11.0168,
    lng: 76.9558
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">
        Route to {restaurant.name}
      </h2>

      <MapRoute restaurant={restaurant} />
    </div>
  );
}
