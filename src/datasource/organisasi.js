const BaseDatasource = require('./index');

class OrganisasiAPI extends BaseDatasource {
  constructor() {
    super();
    this.collectionName = 'organisasi'; // Defining collection name at class level
  }


}

module.exports = new OrganisasiAPI();