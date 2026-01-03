// src/api/hasura.js
import client from "../apolloClient";
import { gql } from "@apollo/client";

/* =========================
   USERS
========================= */
const INSERT_TEMP_USER = gql`
  mutation InsertTempUser($phone: String!) {
    insert_users_one(
      object: {
        phone: $phone
        name: "Temp User"
        role: "TEMP"
      }
    ) {
      id
      phone
    }
  }
`;

export const createUser = async (phone) => {
  const res = await client.mutate({
    mutation: INSERT_TEMP_USER,
    variables: { phone },
  });

  return res.data.insert_users_one;
};


// Get user by phone
export const getUserByPhone = async (phone) => {
  const { data } = await client.query({
    query: gql`
      query GetUser($phone: String!) {
        users(where: { phone: { _eq: $phone } }) {
          id
          phone
        }
      }
    `,
    variables: { phone },
    fetchPolicy: "no-cache",
  });

  return data.users[0];
};

/* =========================
   RESTAURANTS
========================= */

export const fetchRestaurants = async () => {
  const { data } = await client.query({
    query: gql`
      query {
        restaurants {
          id
          name
          address
          image_url
          hygiene_rating
        }
      }
    `,
    fetchPolicy: "no-cache",
  });

  return data.restaurants;
};

/* =========================
   DISHES
========================= */
export const fetchDishesByRestaurant = async (restaurantId) => {
  const { data } = await client.query({
    query: gql`
      query GetRestaurantMenu($id: uuid!) {
        restaurants_by_pk(id: $id) {
          id
          name
          dishes {
            id
            name
            price
            image_url
          }
        }
      }
    `,
    variables: { id: restaurantId },
    fetchPolicy: "no-cache",
  });

  return data.restaurants_by_pk;
};

/* =========================
   CART
========================= */

export const fetchUserCart = async (userId) => {
  const { data } = await client.query({
    query: gql`
      query FetchCart($userId: uuid!) {
        cart_items(
          where: { user_id: { _eq: $userId } }
        ) {
          id
          quantity
          restaurant_id
          dish_id
          dish {
            id
            name
            price
            image_url
          }
        }
      }
    `,
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  return data.cart_items;
};
// Add to cart
export const addToCart = async ({
  user_id,
  dish_id,
  restaurant_id,
  price,
}) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation AddToCart(
        $user_id: uuid!
        $dish_id: uuid!
        $restaurant_id: uuid!
        $price: numeric!
      ) {
        insert_cart_items_one(
          object: {
            user_id: $user_id
            dish_id: $dish_id
            restaurant_id: $restaurant_id
            quantity: 1
            price: $price
          }
        ) {
          id
        }
      }
    `,
    variables: { user_id, dish_id, restaurant_id, price },
  });

  return data.insert_cart_items_one;
};

// Update quantity
export const updateCartQty = async (id, quantity) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation UpdateQty($id: uuid!, $quantity: Int!) {
        update_cart_items_by_pk(
          pk_columns: { id: $id }
          _set: { quantity: $quantity }
        ) {
          id
        }
      }
    `,
    variables: { id, quantity },
  });

  return data.update_cart_items_by_pk;
};

// Remove item
export const removeCartItem = async (id) => {
  await client.mutate({
    mutation: gql`
      mutation RemoveItem($id: uuid!) {
        delete_cart_items_by_pk(id: $id) {
          id
        }
      }
    `,
    variables: { id },
  });
};

// Clear cart after checkout
export const clearUserCart = async (userId) => {
  await client.mutate({
    mutation: gql`
      mutation ClearCart($userId: uuid!) {
        delete_cart_items(where: { user_id: { _eq: $userId } }) {
          affected_rows
        }
      }
    `,
    variables: { userId },
  });
};

/* =========================
   ORDERS
========================= */

export const createOrder = async ({
  user_id,
  total_amount,
  status = "pending",
}) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation CreateOrder($order: orders_insert_input!) {
        insert_orders_one(object: $order) {
          id
          order_number
          total_amount
          status
        }
      }
    `,
    variables: {
      order: { user_id, total_amount, status },
    },
  });

  return data.insert_orders_one;
};

export const insertOrderItems = async (items) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation InsertOrderItems($items: [order_items_insert_input!]!) {
        insert_order_items(objects: $items) {
          affected_rows
        }
      }
    `,
    variables: { items },
  });

  return data.insert_order_items;
};


export const fetchUserOrders = async (userId) => {
  const { data } = await client.query({
    query: gql`
      query GetUserOrders($userId: uuid!) {
        orders(
          where: { user_id: { _eq: $userId } }
          order_by: { created_at: desc }
        ) {
          id
          order_number
          total_amount
          status
          order_items {
            id
            quantity
            price
            dish {
              id
              name
            }
            restaurant {
              id
              name
            }
          }
        }
      }
    `,
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  return data.orders.map((order) => ({
    id: order.id,
    order_number: order.order_number,
    total_amount: order.total_amount,
    status: order.status,
    items: order.order_items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      dish: item.dish,
      restaurant: item.restaurant,
    })),
  }));
};

export const fetchAllDishes = async () => {
  const { data } = await client.query({
    query: gql`
      query {
        dishes {
          id
          name
          image_url
          restaurant_id
        }
      }
    `,
    fetchPolicy: "no-cache", // optional, always get fresh data
  });

  return data.dishes;
};