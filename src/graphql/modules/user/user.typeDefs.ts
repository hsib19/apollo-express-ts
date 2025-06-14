import { gql } from 'graphql-tag';

export const userTypeDefs = gql`

  enum SortBy {
    id
    username
    email
    created_at
    updated_at
  }

  enum SortOrder {
    asc
    desc
  }

  type User {
    id: ID!
    email: String!
    is_active: Boolean!
    role: String!
  } 

  input FilterInput {
    page: Int!
    limit: Int!
    search: String!
    sortBy: SortBy!
    sortOrder: SortOrder!
  }

  type PaginatedUsers {
    total: Int!
    page: Int!
    limit: Int!
    data: [User!]!
  }

  type UsersResponse {
    code: String
    message: String
    data: PaginatedUsers!
  }

  type Query {
    users(input: FilterInput!): UsersResponse!
  }

 
`;
