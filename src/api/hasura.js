// src/api/hasura.js
import client from "../apolloClient";
import { gql } from "@apollo/client";

/* =========================
   USERS
========================= */

// Create user with phone + email
export const createUser = async (phone, email) => {
  const mutation = gql`
    mutation InsertUser($phone: String!, $email: String!) {
      insert_users_one(object: { phone: $phone, email: $email, name: "Temp User", role: "TEMP" }) {
        id
        phone
        email
      }
    }
  `;
  const { data } = await client.mutate({
    mutation,
    variables: { phone, email },
  });
  return data.insert_users_one;
};

// Get user by phone (including email)
export const getUserByPhone = async (phone) => {
  const { data } = await client.query({
    query: gql`
      query GetUser($phone: String!) {
        users(where: { phone: { _eq: $phone } }) {
          id
          phone
          name
        }
      }
    `,
    variables: { phone },
    fetchPolicy: "no-cache",
  });
  return data.users[0]; // return first user if exists
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
        cart_items(where: { user_id: { _eq: $userId } }) {
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

export const addToCart = async ({ user_id, dish_id, restaurant_id, price }) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation AddToCart(
        $user_id: uuid!
        $dish_id: uuid!
        $restaurant_id: uuid!
        $price: numeric!
      ) {
        insert_cart_items_one(
          object: { user_id: $user_id, dish_id: $dish_id, restaurant_id: $restaurant_id, quantity: 1, price: $price }
        ) {
          id
        }
      }
    `,
    variables: { user_id, dish_id, restaurant_id, price },
  });
  return data.insert_cart_items_one;
};

export const updateCartQty = async (id, quantity) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation UpdateQty($id: uuid!, $quantity: Int!) {
        update_cart_items_by_pk(pk_columns: { id: $id }, _set: { quantity: $quantity }) {
          id
        }
      }
    `,
    variables: { id, quantity },
  });
  return data.update_cart_items_by_pk;
};

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

export const createOrder = async ({ user_id, total_amount, status = "pending" }) => {
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
    variables: { order: { user_id, total_amount, status } },
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

/* =========================
   USER ORDERS
========================= */

export const fetchUserOrders = async (userId) => {
  const { data } = await client.query({
    query: gql`
      query GetUserOrders($userId: uuid!) {
        orders(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
          id
          order_number
          total_amount
          status
          order_items {
            id
            quantity
            price
            dish { id name }
            restaurant { id name }
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

/* =========================
   DISHES
========================= */

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
    fetchPolicy: "no-cache",
  });

  return data.dishes;
};

export const updateUserName = async (userId, name) => {
  await client.mutate({
    mutation: gql`
      mutation UpdateUserName($id: uuid!, $name: String!) {
        update_users_by_pk(
          pk_columns: { id: $id }
          _set: { name: $name }
        ) {
          id
        }
      }
    `,
    variables: { id: userId, name },
  });
};

/* =========================
   USER ADDRESSES
========================= */

export const getUserAddress = async (userId) => {
  const { data } = await client.query({
    query: gql`
      query GetUserAddress($userId: uuid!) {
        user_addresses(
          where: {
            user_id: { _eq: $userId }
            
          }
          limit: 1
        ) {
          id
          address_line
          city
          state
          pincode
        }
      }
    `,
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  return data.user_addresses[0] || null;
};

export const upsertUserAddress = async ({
  userId,
  address_line,
  city,
  state,
  pincode,
}) => {
  await client.mutate({
    mutation: gql`
      mutation UpsertUserAddress(
        $userId: uuid!
        $address_line: text!
        $city: text
        $state: text
        $pincode: text
      ) {
        insert_user_addresses_one(
          object: {
            user_id: $userId
            label: "Home"
            address_line: $address_line
            city: $city
            state: $state
            pincode: $pincode
            is_default: true
          }
          on_conflict: {
            constraint: user_addresses_user_id_is_default_key
            update_columns: [
              address_line
              city
              state
              pincode
            ]
          }
        ) {
          id
        }
      }
    `,
    variables: { userId, address_line, city, state, pincode },
  });
};

