import { gql } from 'graphql-tag';

export const helloTypeDefs = gql`
  type Query {
    hello: String
  }
`;
