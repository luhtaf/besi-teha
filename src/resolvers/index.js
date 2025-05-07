const { mergeResolvers } = require('@graphql-tools/merge');
const trackResolvers = require('./track');
const sektorResolvers = require('./sektor');
const organisasiResolvers = require('./organisasi');
const entityResolvers = require('./entity');
const vulnerResolvers = require('./vulner');

// Merge semua resolver
const resolvers = mergeResolvers([
    trackResolvers,
    sektorResolvers,
    organisasiResolvers,
    entityResolvers,
    vulnerResolvers
]);

module.exports = { resolvers };