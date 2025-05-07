const { mergeTypeDefs } = require('@graphql-tools/merge');

const trackTypeDefs = require('./track');
const sektorTypeDefs = require('./sektor');
const organisasiTypeDefs = require('./organisasi');
const entityTypeDefs = require('./entity');
const vulnerTypeDefs = require('./vulner');

const typeDefs = mergeTypeDefs([
  trackTypeDefs,
  sektorTypeDefs,
  organisasiTypeDefs,
  entityTypeDefs,
  vulnerTypeDefs
]);

module.exports = typeDefs;