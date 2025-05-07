const vulnerResolvers = {
    Query: {
        vulners: (_, __, { dataSources }) => {
            return dataSources.vulner.findAll();
        },
        vulner: (_, { id }, { dataSources }) => {
            return dataSources.vulner.findById(id);
        }
    }
};

module.exports = vulnerResolvers;