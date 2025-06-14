import { gql } from 'graphql-tag';

export const authTypeDefs = gql`

  type User {
    email: String!
    is_active: Boolean!
    role: String!
  } 

  type AuthPayload {
    token: String!
    user: User!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginResponse {
    code: String
    message: String
    data: LoginData
  }

  type LoginData {
    token: String!
    user: User!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(input: LoginInput!): LoginResponse!
  }
`;
