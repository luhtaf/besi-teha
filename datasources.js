// Import all datasources
const trackAPI = require('./datasource/track');
const sektorAPI = require('./datasource/sektor');
// other datasources...

// Optional: Initialize them all at once
async function initializeDataSources() {
  if (sektorAPI.initialize) await sektorAPI.initialize();
  // Initialize others...
}

module.exports = {
  dataSources: {
    trackAPI,
    sektor:sektorAPI,

  },
  initializeDataSources
};