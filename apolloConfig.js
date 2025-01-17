// src/apollo-client.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://ash-demo-back.onrender.com/graphql',
    fetchOptions: {
      mode: 'cors', 
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
