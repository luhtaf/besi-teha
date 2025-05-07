const organisasiResolvers = {
    Query: {
        organisasiList: (_, __, { dataSources }) => {
            return dataSources.organisasi.findAll();
        },
        organisasi: (_, { id }, { dataSources }) => {
            return dataSources.organisasi.findById(id);
        }
    },
    Mutation: {
        createOrganisasi: (_, { input }, { dataSources }) => {
            return dataSources.organisasi.create(input);
        },
        updateOrganisasi: (_, { id, input }, { dataSources }) => {
            return dataSources.organisasi.update(id, input);
        },
        deleteOrganisasi: (_, { id }, { dataSources }) => {
            return dataSources.organisasi.delete(id);
        },
        assignAsetToOrganisasi: (_, { asetId, organisasiId }, { dataSources }) => {
            return dataSources.organisasi_aset.assignAsetToOrganisasi(asetId, organisasiId);
        },
        removeAsetFromOrganisasi: (_, { asetId, organisasiId }, { dataSources }) => {
            return dataSources.organisasi_aset.removeAsetFromOrganisasi(asetId, organisasiId);
        }
    },
    Organisasi: {
        sektor: (organisasi, _, { dataSources }) => {
            return dataSources.sektor_organisasi.getSektorByOrganisasiId(organisasi._key);
        },
        aset: (organisasi, _, { dataSources }) => {            
            return dataSources.organisasi_aset.getAsetByOrganisasiId(organisasi._key);
        }
    }
};

module.exports = organisasiResolvers;