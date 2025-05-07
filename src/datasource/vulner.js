const BaseDatasource = require('./index');

class VulnerAPI extends BaseDatasource {
  constructor() {
    super();
    this.collectionName = 'vulner'; 
  }

}

module.exports = new VulnerAPI();