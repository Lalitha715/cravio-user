import { gql } from "@apollo/client";
import { client } from "./hasuraClient";

// Signup mutation
export const SIGNUP_MUTATION = gql`
  mutation InsertUser($name: String!, $email: String!, $password: String!) {
    insert_users_one(object: { name: $name, email: $email, password_hash: $password }) {
      id
      name
      email
    }
  }
`;

// Login query
export const LOGIN_QUERY = gql`
  query GetUser($email: String!, $password: String!) {
    users(where: { email: { _eq: $email }, password_hash: { _eq: $password } }) {
      id
      name
      email
      role
    }
  }
`;

// Functions
export const signupUser = async (name, email, password) => {
  const res = await client.mutate({
    mutation: SIGNUP_MUTATION,
    variables: { name, email, password },
  });
  return res.data.insert_users_one;
};

export const loginUser = async (email, password) => {
  const res = await client.query({
    query: LOGIN_QUERY,
    variables: { email, password },
    fetchPolicy: "network-only",
  });
  return res.data.users[0];
};
