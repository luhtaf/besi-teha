require('dotenv').config();
const { Database, aql } = require('arangojs');

class BaseDatasource {
  constructor() {
    this.username = process.env.DB_USERNAME;
    this.password = process.env.DB_PASSWORD;
    this.url = process.env.DB_URL || 'http://127.0.0.1:8529';
    this.dbName = process.env.DB_NAME || '_system';
    this.db = null;
    this.collections = {};
    
    // Child classes must set this
    this.collectionName = null;
  }

  /**
   * Initialize the database connection
   */
  async initialize() {
    try {
      if (this.db) return this.db;
      
      // Connect to ArangoDB
      this.db = new Database({
        url: this.url,
        databaseName: this.dbName,
        auth: {
          username: this.username,
          password: this.password
        }
      });
      
      console.log(`Successfully connected to ArangoDB at ${this.url} (database: ${this.dbName})`);
      
      // Initialize the collection if needed
      if (this.collectionName) {
        await this.getCollection(this.collectionName);
      }
      
      return this.db;
    } catch (error) {
      console.error(`Failed to connect to the database:`, error);
      throw error;
    }
  }

  /**
   * Get a collection reference, initializing it if needed
   * @param {string} collectionName - Name of the collection
   * @returns {Promise<Collection>} ArangoDB collection
   */
  async getCollection(collectionName) {
    if (!this.db) {
      await this.initialize();
    }
    
    if (!this.collections[collectionName]) {
      const collection = this.db.collection(collectionName);
      const exists = await collection.exists();
      
      if (!exists) {
        await collection.create();
        console.log(`Created collection: ${collectionName}`);
      }
      
      this.collections[collectionName] = collection;
    }
    
    return this.collections[collectionName];
  }

  /* GENERIC CRUD OPERATIONS - using this.collectionName */

  /**
   * Create a document in the collection
   * @param {Object} data - Document data to insert
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Get the collection object first
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        INSERT ${data} INTO ${collection}
        RETURN NEW
      `);
      
      const results = await cursor.all();
      return results[0];
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get all documents from the collection
   * @param {Object} filters - Optional filter conditions
   * @returns {Promise<Array>} Array of documents
   */
  async findAll(filters = {}) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Get collection object first
      const collection = await this.getCollection(this.collectionName);
      
      // Build filter conditions if provided
      let query;
      
      if (Object.keys(filters).length === 0) {
        // No filters - using collection object instead of string
        query = aql`
          FOR doc IN ${collection}
          RETURN doc
        `;
      } else {
        // With filters
        const filterStr = Object.entries(filters)
          .map(([key, value]) => `doc.${key} == ${JSON.stringify(value)}`)
          .join(' AND ');
        
        query = aql`
          FOR doc IN ${collection}
          FILTER ${filterStr}
          RETURN doc
        `;
      }
      
      const cursor = await this.db.query(query);
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching documents from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Find document by ID or key
   * @param {string} id - Document ID or key
   * @returns {Promise<Object|null>} Document or null if not found
   */
  async findById(id) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Get the collection object first
      const collection = await this.getCollection(this.collectionName);
      
      // Use the collection object in the query
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${id} OR doc.id == ${id}
        LIMIT 1
        RETURN doc
      `);
      
      const results = await cursor.all();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error fetching document with ID ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document by ID
   * @param {string} id - Document ID or key
   * @param {Object} data - Update data
   * @returns {Promise<Object|null>} Updated document or null
   */
  async update(id, data) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Get the collection object first
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${id} OR doc.id == ${id}
        UPDATE doc WITH ${data} IN ${collection}
        RETURN NEW
      `);
      
      const results = await cursor.all();
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      console.error(`Error updating document with ID ${id} in ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document by ID
   * @param {string} id - Document ID or key
   * @returns {Promise<boolean>} Success indicator
   */
  async delete(id) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Get the collection object first
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${id} OR doc.id == ${id}
        REMOVE doc IN ${collection}
        RETURN OLD
      `);
      
      const results = await cursor.all();
      return results.length > 0;
    } catch (error) {
      console.error(`Error deleting document with ID ${id} from ${this.collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Execute a custom AQL query
   * @param {string} query - AQL query to execute
   * @param {Object} bindVars - Variables to bind to the query
   * @returns {Promise<Cursor>} Query cursor
   */
  async query(query, bindVars = {}) {
    if (!this.db) {
      await this.initialize();
    }
    
    return this.db.query(query, bindVars);
  }

  /**
   * Close the database connection
   */
  async disconnect() {
    if (this.db) {
      this.db = null;
      this.collections = {};
      console.log(`Database connection closed`);
    }
  }
}

module.exports = BaseDatasource;