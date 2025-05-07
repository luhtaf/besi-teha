const BaseDatasource = require('./index');

class EntityAPI extends BaseDatasource {
  constructor() {
    super();
    this.collectionName = 'entity'; 
  }


}

module.exports = new EntityAPI();