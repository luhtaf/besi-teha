const { gql } = require('graphql-tag');

const vulnerTypeDefs = gql`
  type Vulner {
    _key: ID!
    nama: String!
    type: String!
    skor: String!
    severity: String!
    createdAt: String
    updatedAt: String
  }

  type VulnerReference {
    _key: ID!
    nama: String!
    type: String!
    skor: String!
    severity: String!
    createdAt: String
    updatedAt: String
  }

  input VulnerInput {
    nama: String!
    skor: String!
    severity: String!
  }

  extend type Query {
    vulners: [Vulner]
    vulner(id: ID!): Vulner
  }

`;

module.exports = vulnerTypeDefs;