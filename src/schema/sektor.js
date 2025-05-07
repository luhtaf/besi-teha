const { gql } = require('graphql-tag');

const sektorTypeDefs = gql`
  type Sektor {
    _key: ID!
    nama: String!
    deskripsi: String!
    organisasi: [Organisasi] 
    createdAt: String
    updatedAt: String
  }

  type SektorReference {
    _key: ID!
    nama: String!
    deskripsi: String
    createdAt: String
    updatedAt: String
  }

  input SektorInput {
    nama: String!
    deskripsi: String
  }

  type Query {
    sektors: [Sektor]
    sektor(id: ID!): Sektor
  }

  type OperationResult {
    success: Boolean!
    message: String
  }

  type Mutation {
    createSektor(input: SektorInput!): OperationResult
    updateSektor(id: ID!, input: SektorInput!): OperationResult
    deleteSektor(id: ID!): OperationResult
    assignOrganisasiToSektor(sektorId: ID!, organisasiId: ID!): OperationResult

  }
`;

module.exports = sektorTypeDefs;