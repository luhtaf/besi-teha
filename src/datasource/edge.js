const BaseDatasource = require('./index');
const { aql } = require('arangojs');

class EdgeDatasource extends BaseDatasource {
  constructor(options = {}) {
    // Set default to edge collection type
    super({
      timestamps: true,
      collectionType: 'edge',
      ...options
    });
  }
  
  /**
   * Create an edge between two documents
   * @param {string} fromId - Source document ID
   * @param {string} toId - Target document ID
   * @param {Object} data - Edge data
   */
  async createEdge(fromId, toId, data = {}) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Prepare edge data with from and to
      const edgeData = {
        _from: fromId,
        _to: toId,
        ...data
      };
      
      // Process lifecycle hook
      const processedData = await this.beforeCreate(edgeData);
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        INSERT ${processedData} INTO ${collection}
        RETURN NEW
      `);
      
      const results = await cursor.all();
      
      // Process after hook
      return await this.afterCreate(results[0]);
    } catch (error) {
      console.error(`Error creating edge in ${this.collectionName}:`, error);
      throw error;
    }
  }
  
  /**
   * Find edges starting from a document
   * @param {string} fromId - Source document ID
   */
  async findOutbound(fromId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId}
        RETURN edge
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error finding outbound edges from ${fromId}:`, error);
      throw error;
    }
  }
  
  /**
   * Find edges pointing to a document
   * @param {string} toId - Target document ID
   */
  async findInbound(toId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._to == ${toId}
        RETURN edge
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error finding inbound edges to ${toId}:`, error);
      throw error;
    }
  }
}

module.exports = EdgeDatasource;