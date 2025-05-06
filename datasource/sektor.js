const BaseDatasource = require('./index');
const { aql } = require('arangojs');

class SektorAPI extends BaseDatasource {
  constructor() {
    super();
    this.collectionName = 'sektor'; // Defining collection name at class level
  }


  /**
   * Get sectors grouped by category with count
   */
  async getSektorStatsByCategory() {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      const cursor = await this.db.query(aql`
        FOR doc IN ${this.collectionName}
        COLLECT category = doc.category INTO sektorsInCategory
        RETURN {
          category: category || "Uncategorized",
          count: LENGTH(sektorsInCategory),
          totalBudget: SUM(
            FOR item IN sektorsInCategory
            RETURN item.doc.budget || 0
          )
        }
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error('Error getting sektor stats by category:', error);
      throw error;
    }
  }
}

module.exports = new SektorAPI();