const { mergeTypeDefs } = require('@graphql-tools/merge');

const trackTypeDefs = require('./track');
const sektorTypeDefs = require('./sektor');

// Merge all type definitions
const typeDefs = mergeTypeDefs([
  trackTypeDefs,
  sektorTypeDefs
]);

module.exports = typeDefs;