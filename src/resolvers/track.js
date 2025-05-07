const trackResolvers = {
    Query: {
        tracksForHome: (_, __, { dataSources }) => {
            return dataSources.trackAPI.getTracks();
        },
        track: (_, { id }, { dataSources }) => {
            return dataSources.trackAPI.getTrackById(id);
        },
    }
};

module.exports = trackResolvers;