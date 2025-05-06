const resolvers = {
    Query: {
        // Track resolvers
        tracksForHome: (_, __, { dataSources }) => {
            return dataSources.trackAPI.getTracks();
        },
        track: (_, { id }, { dataSources }) => {
            return dataSources.trackAPI.getTrackById(id);
        },
        
        // Sektor resolvers
        sektors: (_, __, { dataSources }) => {
            return dataSources.sektorAPI.findAll();
        },
        sektor: (_, { id }, { dataSources }) => {
            return dataSources.sektorAPI.findById(id);
        }
    },
    Mutation: {
        createSektor: (_, { input }, { dataSources }) => {
            return dataSources.sektorAPI.create(input);
        },
        updateSektor: (_, { id, input }, { dataSources }) => {
            return dataSources.sektorAPI.update(id, input);
        },
        deleteSektor: (_, { id }, { dataSources }) => {
            return dataSources.sektorAPI.delete(id);
        }
    }
};

module.exports = { resolvers };