import { useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";

const GET_RESTAURANT = gql`
  query GetRestaurant($id: uuid!) {
    restaurants_by_pk(id: $id) {
      name
      address
      phone
      email
      created_at
    }
  }
`;

export default function RestaurantDetails() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_RESTAURANT, {
    variables: { id },
    skip: !id,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurant</p>;
  if (!data?.restaurants_by_pk) return <p>Not found</p>;

  const r = data.restaurants_by_pk;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-orange-500">{r.name}</h1>
      <p>{r.address}</p>
      <p>{r.phone}</p>
      <p>{r.email}</p>
    </div>
  );
}
