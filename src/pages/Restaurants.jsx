import { gql, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const GET_RESTAURANTS = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      address
      phone
    }
  }
`;

export default function Restaurants() {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_RESTAURANTS);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p>Error loading restaurants</p>;

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>

      <div className="grid gap-4">
        {data.restaurants.map((res) => (
          <div
            key={res.id}
            onClick={() => navigate(`/restaurant/${res.id}`)}
            className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">{res.name}</h2>
            <p className="text-sm text-gray-500">{res.address}</p>
            <p className="text-sm text-gray-500">{res.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
