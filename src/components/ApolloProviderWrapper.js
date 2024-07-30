// src/components/ApolloProviderWrapper.js
'use client';
import { ApolloProvider } from '@apollo/client';
import client from '../../apolloConfig';

const ApolloProviderWrapper = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
