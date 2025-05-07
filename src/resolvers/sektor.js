const sektorResolvers = {
    Query: {
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
        },
        assignOrganisasiToSektor: (_, { sektorId, organisasiId }, { dataSources }) => {
            return dataSources.sektor_organisasi.assignOrganisasiToSektor(sektorId, organisasiId, {type:'has'});
        },
      
        
    },
    Sektor: {
        organisasi: (sektor, _, { dataSources }) => {
            return dataSources.sektor_organisasi.getOrganisasiBySektorId(sektor._key);
        }
    }
};

module.exports = sektorResolvers;