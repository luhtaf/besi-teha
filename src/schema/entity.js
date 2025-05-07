const { gql } = require('graphql-tag');

const entityTypeDefs = gql`
  type Entity {
    _key: ID!
    nilai: String!
    type: String!
    organisasi: [Organisasi]
    vulner: [Vulner]
    createdAt: String
    updatedAt: String
  }

  type EntityReference {
    _key: ID!
    nilai: String!
    type: String!
    createdAt: String
    updatedAt: String
  }

  input EntityInput {
    nilai: String!
    type: String!
  }

  extend type Query {
    entityList: [Entity]
    entity(id: ID!): Entity
  }


  extend type Mutation {
    createEntity(input: EntityInput!): OperationResult
    updateEntity(id: ID!, input: EntityInput!): OperationResult
    deleteEntity(id: ID!): OperationResult
    assignVulnerabilityToAset(asetId: ID!, vulnerabilityId: ID!): OperationResult
  }
`;

module.exports = entityTypeDefs;