import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const GET_RESTAURANTS = gql`
  query {
    restaurants {
      id
      name
      address
    }
  }
`;

function Home() {
  const { data, loading } = useQuery(GET_RESTAURANTS);
  const navigate = useNavigate();

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Header />

      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">
          Restaurants near you
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.restaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => navigate(`/restaurant/${res.id}`)}
              className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:scale-105 transition"
            >
              <h3 className="text-lg font-bold">{res.name}</h3>
              <p className="text-gray-500 text-sm mt-1">
                {res.address}
              </p>
            </div>
          ))}
        </div>
      </div>
      <BottomNav/>
    </>
  );
}

export default Home;
