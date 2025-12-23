import { gql } from "@apollo/client";
import client from "./apolloClient";

/* ================================
   FETCH RESTAURANTS
================================ */
export const fetchRestaurants = async () => {
  const res = await client.query({
    query: gql`
      query {
        restaurants {
          id
          name
          address
        }
      }
    `,
    fetchPolicy: "no-cache",
  });

  return res.data.restaurants;
};

/* ================================
   FETCH DISHES BY RESTAURANT
================================ */
export const fetchDishesByRestaurant = async (restaurantId) => {
  const res = await client.query({
    query: gql`
      query ($restaurant_id: uuid!) {
        dishes(where: { restaurant_id: { _eq: $restaurant_id } }) {
          id
          name
          price
          image_url
          restaurant_id
        }
      }
    `,
    variables: {
      restaurant_id: restaurantId,
    },
    fetchPolicy: "no-cache",
  });

  return res.data.dishes;
};

/* ================================
   PLACE ORDER
================================ */
export const placeOrder = async (orderData) => {
  return client.mutate({
    mutation: gql`
      mutation InsertOrder(
        $user_id: uuid!,
        $restaurant_id: uuid!,
        $total_amount: numeric!,
        $status: String!,
        $items: jsonb,
        $payment_method: String
      ) {
        insert_orders_one(object: {
          user_id: $user_id,
          restaurant_id: $restaurant_id,
          total_amount: $total_amount,
          status: $status,
          items: $items,
          payment_method: $payment_method
        }) {
          id
        }
      }
    `,
    variables: orderData
  });
};


export const fetchUserOrders = async (userId) => {
  const res = await client.query({
    query: gql`
      query ($user_id: uuid!) {
        orders(where: { user_id: { _eq: $user_id } }, order_by: { created_at: desc }) {
          id
          order_number
          items
          total_amount
          status
          payment_method
        }
      }
    `,
    variables: { user_id: userId },
    fetchPolicy: "network-only",
  });
  return res.data.orders;
};
