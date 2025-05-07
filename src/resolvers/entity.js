const entityResolvers = {
    Query: {
        entityList: (_, __, { dataSources }) => {
            return dataSources.entity.findAll();
        },
        entity: (_, { id }, { dataSources }) => {
            return dataSources.entity.findById(id);
        }
    },
    Mutation: {
        createEntity: (_, { input }, { dataSources }) => {
            return dataSources.entity.create(input);
        },
        updateEntity: (_, { id, input }, { dataSources }) => {
            return dataSources.entity.update(id, input);
        },
        deleteEntity: (_, { id }, { dataSources }) => {
            return dataSources.entity.delete(id);
        },
        assignVulnerabilityToAset: (_, { asetId, vulnerabilityId }, { dataSources }) => {
            return dataSources.aset_vulnerability.assignVulnerabilityToAset(asetId, vulnerabilityId);
        }
    },
    Entity: {
        organisasi: (entity, _, { dataSources }) => {
            return dataSources.organisasi_aset.getOrganisasiByAsetId(entity._key);
        },
        vulner: (entity, _, { dataSources }) => {
            return dataSources.aset_vulnerability.getVulnerabilityByAsetId(entity._key);
        }
    }
};

module.exports = entityResolvers;