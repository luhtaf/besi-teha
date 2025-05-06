const { gql } = require('graphql-tag');

const trackTypeDefs = gql`
  type Track {
    id: ID
    "The track's title"
    title: String
    "The track's main author"
    author: String
    "The track's main illustration to display in track card or track page detail"
    thumbnail: String
    "The track's approximate length to complete, in minutes"
    length: Int
    "The number of modules this track contains"
    modulesCount: Int
  }

  extend type Query {
    "Get tracks array for homepage grid"
    tracksForHome: [Track]
    track(id: ID!): Track
  }
`;

module.exports = trackTypeDefs;