import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://sought-shad-46.hasura.app/v1/graphql", // replace with your Hasura URL
  headers: {
    "x-hasura-admin-secret": "wXhAdwe6ZSKqcitYfoxL05eTxapEwiBdZL5Qr1vw7WBqdQv4gGbKcQH5zh4YMTYr", // or leave empty for anon role
  },
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
