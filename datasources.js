// Import all datasources
const trackAPI = require('./src/datasource/track');
const sektorAPI = require('./src/datasource/sektor');
const organisasiAPI = require('./src/datasource/organisasi');
const sektorOrganisasiAPI = require('./src/datasource/sektororganisasi');
const entityAPI = require('./src/datasource/entity');
const vulnerAPI = require('./src/datasource/vulner');
const organisasiAsetAPI = require('./src/datasource/organisasiaset');
const asetVulnerabilityAPI = require('./src/datasource/asetVulnerability');
// other datasources...

// Optional: Initialize them all at once
async function initializeDataSources() {
  if (sektorAPI.initialize) await sektorAPI.initialize();
  if (organisasiAPI.initialize) await organisasiAPI.initialize();
  if (sektorOrganisasiAPI.initialize) await sektorOrganisasiAPI.initialize();
  if (entityAPI.initialize) await entityAPI.initialize();
  if (vulnerAPI.initialize) await vulnerAPI.initialize();
  if (organisasiAsetAPI.initialize) await organisasiAsetAPI.initialize();
  if (asetVulnerabilityAPI.initialize) await asetVulnerabilityAPI.initialize();
  // Initialize others...
}

module.exports = {
  dataSources: {
    trackAPI,
    sektor:sektorAPI,
    organisasi:organisasiAPI,
    sektor_organisasi:sektorOrganisasiAPI,
    entity:entityAPI,
    vulner:vulnerAPI,
    organisasi_aset:organisasiAsetAPI,
    aset_vulnerability:asetVulnerabilityAPI
  },
  initializeDataSources
};