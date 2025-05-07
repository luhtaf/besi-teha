const { gql } = require('graphql-tag');

const organisasiTypeDefs = gql`
  type Organisasi {
    _key: ID!
    nama: String!
    deskripsi: String
    sektor: [Sektor]
    aset: [Entity]
    createdAt: String
    updatedAt: String
  }

  type OrganisasiReference {
    _key: ID!
    nama: String!
    deskripsi: String
    createdAt: String
    updatedAt: String
  }

  input OrganisasiInput {
    nama: String!
    deskripsi: String
  }

  extend type Query {
    organisasiList: [Organisasi]
    organisasi(id: ID!): Organisasi
  }

  extend type Mutation {
    createOrganisasi(input: OrganisasiInput!): OperationResult
    updateOrganisasi(id: ID!, input: OrganisasiInput!): OperationResult
    deleteOrganisasi(id: ID!): OperationResult
    assignAsetToOrganisasi(asetId: ID!, organisasiId: ID!): OperationResult
    removeAsetFromOrganisasi(asetId: ID!, organisasiId: ID!): OperationResult
  }
`;

module.exports = organisasiTypeDefs;