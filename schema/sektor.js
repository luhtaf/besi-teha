const { gql } = require('graphql-tag');

const sektorTypeDefs = gql`
  type Sektor {
    _key: ID!
    nama: String!
    deskripsi: String!
    createdAt: String
  }

  input SektorInput {
    nama: String!
    deskripsi: String
    createdAt: String
  }

  type Query {
    sektors: [Sektor!]!
    sektor(id: ID!): Sektor
  }

  type Mutation {
    createSektor(input: SektorInput!): Sektor
    updateSektor(id: ID!, input: SektorInput!): Sektor
    deleteSektor(id: ID!): Boolean
  }
`;

module.exports = sektorTypeDefs;