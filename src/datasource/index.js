require('dotenv').config();
const { Database, aql } = require('arangojs');

class BaseDatasource {
  constructor(options = {}) {
    this.username = process.env.DB_USERNAME;
    this.password = process.env.DB_PASSWORD;
    this.url = process.env.DB_URL || 'http://127.0.0.1:8529';
    this.dbName = process.env.DB_NAME || '_system';
    this.db = null;
    this.collections = {};
    
    // Configuration options with defaults
    this.options = {
      timestamps: true, // Default: enable automatic timestamps
      collectionType: 'document', // 'document' or 'edge'
      ...options
    };
    
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
   */
  async getCollection(collectionName) {
    if (!this.db) {
      await this.initialize();
    }
    
    if (!this.collections[collectionName]) {
      // Get collection reference first
      const collection = this.db.collection(collectionName);
      const exists = await collection.exists();
      
      if (!exists) {
        // When creating a new collection, specify the type
        if (this.options.collectionType === 'edge') {
          await collection.create({ type: 3 }); // Type 3 is for edge collections
          console.log(`Created edge collection: ${collectionName}`);
        } else {
          await collection.create(); // Default is document collection
          console.log(`Created document collection: ${collectionName}`);
        }
      }
      
      this.collections[collectionName] = collection;
    }
    
    return this.collections[collectionName];
  }

  /* LIFECYCLE HOOKS - Can be overridden by subclasses */
  
  /**
   * Hook called before creating a document
   * @param {Object} data - The data to be inserted
   * @returns {Object} - Modified data
   */
  async beforeCreate(data) {
    // Apply timestamps only if enabled
    if (this.options.timestamps) {
      const timestamp = new Date().toISOString();
      return {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }
    return data;
  }

  /**
   * Hook called after a document is created
   * @param {Object} result - The created document
   * @returns {Object} - Potentially modified result
   */
  async afterCreate(result) {
    return result;
  }

  /**
   * Hook called before updating a document
   * @param {string} id - Document ID
   * @param {Object} data - Update data
   * @returns {Object} - Modified update data
   */
  async beforeUpdate(id, data) {
    // Apply timestamps only if enabled
    if (this.options.timestamps) {
      return {
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
    return data;
  }

  /**
   * Hook called after a document is updated
   * @param {Object} result - The updated document
   * @returns {Object} - Potentially modified result
   */
  async afterUpdate(result) {
    return result;
  }

  /**
   * Hook called before deleting a document
   * @param {string} id - Document ID to be deleted
   * @returns {string} - Potentially modified ID
   */
  async beforeDelete(id) {
    return id;
  }

  /**
   * Hook called after a document is deleted
   * @param {boolean} result - Result of deletion
   * @returns {boolean} - Potentially modified result
   */
  async afterDelete(result) {
    return result;
  }

  /* CRUD OPERATIONS */

  /**
   * Create a document in the collection
   */
  async create(data) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Process lifecycle hook
      const processedData = await this.beforeCreate(data);
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        INSERT ${processedData} INTO ${collection}
        RETURN NEW
      `);
      
      const results = await cursor.all();
      
      // Process after hook
      await this.afterCreate(results[0]);
      
      // Return OperationResult
      return {
        success: true,
        message: `Successfully created document in ${this.collectionName}`
      };
    } catch (error) {
      console.error(`Error creating document in ${this.collectionName}:`, error);
      return {
        success: false,
        message: `Failed to create document: ${error.message}`
      };
    }
  }

  /**
   * Get all documents from the collection
   */
  async findAll(filters = {}) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      const collection = await this.getCollection(this.collectionName);
      
      let query;
      
      if (Object.keys(filters).length === 0) {
        query = aql`
          FOR doc IN ${collection}
          RETURN doc
        `;
      } else {
        const filterConditions = Object.entries(filters)
          .map(([key, value]) => `doc.${key} == ${JSON.stringify(value)}`)
          .join(' AND ');
        
        query = aql`
          FOR doc IN ${collection}
          FILTER ${filterConditions}
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
   * Find document by ID
   */
  async findById(id) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      const collection = await this.getCollection(this.collectionName);
      
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
   */
  async update(id, data) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Process lifecycle hook
      const processedData = await this.beforeUpdate(id, data);
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${id} OR doc.id == ${id}
        UPDATE doc WITH ${processedData} IN ${collection}
        RETURN NEW
      `);
      
      const results = await cursor.all();
      
      if (results.length === 0) {
        return {
          success: false,
          message: `Document with ID ${id} not found in ${this.collectionName}`
        };
      }
      
      // Process after hook
      await this.afterUpdate(results[0]);
      
      // Return OperationResult
      return {
        success: true,
        message: `Successfully updated document with ID ${id} in ${this.collectionName}`
      };
    } catch (error) {
      console.error(`Error updating document with ID ${id} in ${this.collectionName}:`, error);
      return {
        success: false,
        message: `Failed to update document: ${error.message}`
      };
    }
  }

  /**
   * Delete a document by ID
   */
  async delete(id) {
    if (!this.collectionName) {
      throw new Error('Collection name not defined in datasource');
    }
    
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Process lifecycle hook
      const processedId = await this.beforeDelete(id);
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR doc IN ${collection}
        FILTER doc._key == ${processedId} OR doc.id == ${processedId}
        REMOVE doc IN ${collection}
        RETURN OLD
      `);
      
      const results = await cursor.all();
      
      if (results.length === 0) {
        return {
          success: false,
          message: `Document with ID ${id} not found in ${this.collectionName}`
        };
      }
      
      // Process after hook
      await this.afterDelete(results.length > 0);
      
      // Return OperationResult
      return {
        success: true,
        message: `Successfully deleted document with ID ${id} from ${this.collectionName}`
      };
    } catch (error) {
      console.error(`Error deleting document with ID ${id} from ${this.collectionName}:`, error);
      return {
        success: false,
        message: `Failed to delete document: ${error.message}`
      };
    }
  }

  /**
   * Execute a custom AQL query
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