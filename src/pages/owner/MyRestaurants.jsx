import React from "react";
import { useQuery, gql } from "@apollo/client";

const MY_RESTAURANTS = gql`
  query MyRestaurants($ownerId: uuid!) {
    restaurants(where: { created_by: { _eq: $ownerId } }) {
      id
      name
      status
    }
  }
`;

export default function MyRestaurants({ currentUser }) {
  const { data, loading, error } = useQuery(MY_RESTAURANTS, {
    variables: { ownerId: currentUser.id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>
      <ul>
        {data.restaurants.map((r) => (
          <li key={r.id} className="border p-2 mb-2">
            {r.name} - <strong>{r.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
