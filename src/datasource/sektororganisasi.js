const EdgeDatasource = require('./edge');
const { aql } = require('arangojs');

class SektorOrganisasiAPI extends EdgeDatasource {
  constructor() {
    super({
      timestamps: true,
      collectionType: 'edge'
    });
    this.collectionName = 'sektor_organisasi';
  }
  
  /**
   * Assign organisasi ke sektor
   * @param {string} sektorId - ID sektor
   * @param {string} organisasiId - ID organisasi
   * @param {Object} metadata - Data tambahan tentang relasi (opsional)
   * @returns {Promise<Object>} - Edge document yang dibuat
   */
  async assignOrganisasiToSektor(sektorId, organisasiId, metadata = {}) {
    try {
      // Pastikan ID dalam format yang benar
      const fromId = sektorId.startsWith('sektor/') ? sektorId : `sektor/${sektorId}`;
      const toId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      
      // Buat edge (tidak perlu menyimpan hasilnya)
      await this.createEdge(fromId, toId, {
        ...metadata,
        dateAssigned: new Date().toISOString()
      });      
      // Kembalikan respons dengan success dan pesan
      return {
        success: true,
        message: `Berhasil mengaitkan organisasi ${organisasiId} ke sektor ${sektorId}`
      };
    } catch (error) {
      console.error(`Error assigning organization ${organisasiId} to sector ${sektorId}:`, error);
      
      // Kembalikan respons error
      return {
        success: false,
        message: `Gagal mengaitkan organisasi: ${error.message}`
      };
    }
  }
  
  /**
   * Hapus relasi organisasi dari sektor
   * @param {string} sektorId - ID sektor
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<boolean>} - True jika berhasil dihapus
   */
  async removeOrganisasiFromSektor(sektorId, organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = sektorId.startsWith('sektor/') ? sektorId : `sektor/${sektorId}`;
      const toId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId} AND edge._to == ${toId}
        REMOVE edge IN ${collection}
        RETURN OLD
      `);
      
      const results = await cursor.all();
      const success = results.length > 0;
      
      return {
        success: success,
        message: success 
          ? `Berhasil menghapus kaitan organisasi ${organisasiId} dari sektor ${sektorId}` 
          : 'Relasi tidak ditemukan'
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal menghapus kaitan: ${error.message}`
      };
    }
  }
  
  /**
   * Dapatkan semua organisasi dalam sektor tertentu
   * @param {string} sektorId - ID sektor
   * @returns {Promise<Array>} - Array organisasi
   */
  async getOrganisasiBySektorId(sektorId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = sektorId.startsWith('sektor/') ? sektorId : `sektor/${sektorId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId}
        LET organisasi = DOCUMENT(edge._to)
        RETURN {
          _key: organisasi._key,
          nama: organisasi.nama,
          deskripsi: organisasi.deskripsi,
        }
      `);

      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching organizations for sector ${sektorId}:`, error);
      throw error;
    }
  }
  
  /**
   * Dapatkan semua sektor untuk organisasi tertentu
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<Array>} - Array sektor
   */
  async getSektorByOrganisasiId(organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const toId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._to == ${toId}
        LET sektor = DOCUMENT(edge._from)
        RETURN {
          _key: sektor._key,
          nama: sektor.nama,
          deskripsi: sektor.deskripsi,
        }
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching sectors for organization ${organisasiId}:`, error);
      throw error;
    }
  }
  
  /**
   * Cek apakah organisasi terkait dengan sektor
   * @param {string} sektorId - ID sektor
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<boolean>} - True jika relasi ada
   */
  async checkOrganisasiInSektor(sektorId, organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = sektorId.startsWith('sektor/') ? sektorId : `sektor/${sektorId}`;
      const toId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId} AND edge._to == ${toId}
        LIMIT 1
        RETURN edge
      `);
      
      const results = await cursor.all();
      return results.length > 0;
    } catch (error) {
      console.error(`Error checking if organization ${organisasiId} is in sector ${sektorId}:`, error);
      throw error;
    }
  }
}

module.exports = new SektorOrganisasiAPI()