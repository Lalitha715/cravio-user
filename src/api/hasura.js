import client from "../apolloClient";
import { gql } from "@apollo/client";

/* =========================
   RESTAURANTS
========================= */

export const fetchRestaurants = async () => {
  const { data } = await client.query({
    query: gql`
      query GetRestaurants {
        restaurants {
          id
          name
          image_url
          hygiene_rating
          address
          latitude
          longitude
          open_time
          close_time
          status
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
      query GetDishes($restaurantId: uuid!) {
        dishes(where: { restaurant_id: { _eq: $restaurantId } }) {
          id
          name
          description
          price
          image_url
          is_available
          restaurant{
            id
            name
          }
        }
      }
    `,
    variables: { restaurantId },
    fetchPolicy: "no-cache",
  });

  return data.dishes;
};

export const fetchAllDishes = async () => {
  const { data } = await client.query({
    query: gql`
      query GetAllDishes {
        dishes {
          id
          name
          price
          image_url
          restaurant_id
        }
      }
    `,
    fetchPolicy: "no-cache",
  });

  return data.dishes;
};

/* =========================
   USER ORDERS
========================= */

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
          created_at
          
          order_items {
            id
            quantity
            price
            restaurant {
              id
              name
              latitude
              longitude
            }
          }
        }
      }
    `,
    variables: { userId },
    fetchPolicy: "no-cache",
  });

  return data.orders;
};

/* =========================
   USERS (UPDATED - EMAIL AUTH)
========================= */

// 🔥 Create User (Signup)
export const createUser = async ({ email, name,password }) => {
  const { data } = await client.mutate({
    mutation: gql`
      mutation InsertUser( $email: String!, $name: String!, $password: String!) {
        insert_users_one(
          object: {
            email: $email
            name: $name
            role: "user"
            password: $password
          },
          on_conflict: {
            constraint: users_email_key,
            update_columns: [name]
          }
        ) {
          id
          email
          name
          password

        }
      }
    `,
    variables: { password, email, name },
  });

  return data.insert_users_one;
};

// 🔥 Get User by Email (Login)
export const getUserByEmail = async (email) => {
  const { data } = await client.query({
    query: gql`
      query GetUser($email: String!) {
        users(where: { email: { _eq: $email } }) {
          id
          uid
          name
          email
          password
          role
          is_active
        }
      }
    `,
    variables: { email },
    fetchPolicy: "no-cache",
  });

  return data.users[0] || null;
};

// 🔥 Advanced: Get or Create User (Safe flow)
export const getOrCreateUser = async ({ uid, email, name }) => {
  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return existingUser;
    }

    return await createUser({ uid, email, name });
  } catch (err) {
    console.error("User creation error:", err);
    throw err;
  }
};

/* =========================
   USER ADDRESSES
========================= */

export const getUserAddress = async (userId) => {
  const { data } = await client.query({
    query: gql`
      query GetUserAddress($userId: uuid!) {
        user_addresses(
          where: { user_id: { _eq: $userId }, is_default: { _eq: true } }
          limit: 1
        ) {
          id
          address_line
          city
          state
          pincode
          latitude
          longitude
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
  latitude,
  longitude,
}) => {
  await client.mutate({
    mutation: gql`
      mutation ResetDefaultAddress($userId: uuid!) {
        update_user_addresses(
          where: { user_id: { _eq: $userId }, is_default: { _eq: true } }
          _set: { is_default: false }
        ) {
          affected_rows
        }
      }
    `,
    variables: { userId },
  });

  const { data } = await client.mutate({
    mutation: gql`
      mutation InsertUserAddress(
        $userId: uuid!
        $address_line: String!
        $city: String
        $state: String
        $pincode: String
        $latitude: float8
        $longitude: float8
      ) {
        insert_user_addresses_one(
          object: {
            user_id: $userId
            label: "Home"
            address_line: $address_line
            city: $city
            state: $state
            pincode: $pincode
            latitude: $latitude
            longitude: $longitude
            is_default: true
          }
        ) {
          id
          latitude
          longitude
        }
      }
    `,
    variables: {
      userId,
      address_line,
      city,
      state,
      pincode,
      latitude,
      longitude,
    },
  });

  return data.insert_user_addresses_one;
};

/* =========================
   ORDERS
========================= */

export const createOrder = async ({
  user_id,
  address_id,
  total_amount,
  status = "pending",
  payment_method,
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
      order: {
        user_id,
        address_id,
        total_amount,
        status,
        payment_method,
      },
    },
  });

  return data.insert_orders_one;
};

/* =========================
   ORDER ITEMS
========================= */

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
   CLEAR CART
========================= */

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