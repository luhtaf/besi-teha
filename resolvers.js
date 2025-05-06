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
            return dataSources.sektor.findAll();
        },
        sektor: (_, { id }, { dataSources }) => {
            return dataSources.sektor.findById(id);
        }
    },
    Mutation: {
        createSektor: (_, { input }, { dataSources }) => {
            return dataSources.sektor.create(input);
        },
        updateSektor: (_, { id, input }, { dataSources }) => {
            return dataSources.sektor.update(id, input);
        },
        deleteSektor: (_, { id }, { dataSources }) => {
            return dataSources.sektor.delete(id);
        }
    }
};

module.exports = { resolvers };