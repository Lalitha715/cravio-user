// services/hasuraClient.js
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://sought-shad-46.hasura.app/v1/graphql", // replace with your Hasura endpoint
    headers: {
      "x-hasura-admin-secret": "wXhAdwe6ZSKqcitYfoxL05eTxapEwiBdZL5Qr1vw7WBqdQv4gGbKcQH5zh4YMTYr", // replace with your secret
    },
  }),
  cache: new InMemoryCache(),
});
