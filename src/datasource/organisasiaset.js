const EdgeDatasource = require('./edge');
const { aql } = require('arangojs');

class OrganisasiAsetAPI extends EdgeDatasource {
  constructor() {
    super({
      timestamps: true,
      collectionType: 'edge'
    });
    this.collectionName = 'organisasi_aset';
  }
  
  /**
   * Assign aset ke organisasi
   * @param {string} asetId - ID aset
   * @param {string} organisasiId - ID organisasi
   * @param {Object} metadata - Data tambahan tentang relasi (opsional)
   * @returns {Promise<Object>} - OperationResult
   */
  async assignAsetToOrganisasi(asetId, organisasiId, metadata = {}) {
    try {
      // Pastikan ID dalam format yang benar
      const fromId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      const toId = asetId.startsWith('entity/') ? asetId : `entity/${asetId}`;
      
      // Buat edge (tidak perlu menyimpan hasilnya)
      await this.createEdge(fromId, toId, {
        ...metadata,
        dateAssigned: new Date().toISOString()
      });      
      // Kembalikan respons dengan success dan pesan
      return {
        success: true,
        message: `Berhasil mengaitkan aset ${asetId} ke organisasi ${organisasiId}`
      };
    } catch (error) {
      console.error(`Error assigning aset ${asetId} to organisasi ${organisasiId}:`, error);
      
      // Kembalikan respons error
      return {
        success: false,
        message: `Gagal mengaitkan aset ke organisasi: ${error.message}`
      };
    }
  }
  
  /**
   * Hapus relasi aset dari organisasi
   * @param {string} asetId - ID aset
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<Object>} - OperationResult
   */
  async removeAsetFromOrganisasi(asetId, organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      const toId = asetId.startsWith('entity/') ? asetId : `entity/${asetId}`;
      
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
          ? `Berhasil menghapus kaitan aset ${asetId} dari organisasi ${organisasiId}` 
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
   * Dapatkan semua aset dalam organisasi tertentu
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<Array>} - Array aset
   */
  async getAsetByOrganisasiId(organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId}
        LET aset = DOCUMENT(edge._to)
        RETURN aset
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching assets for organization ${organisasiId}:`, error);
      throw error;
    }
  }
  
  /**
   * Dapatkan semua organisasi untuk aset tertentu
   * @param {string} asetId - ID aset
   * @returns {Promise<Array>} - Array organisasi
   */
  async getOrganisasiByAsetId(asetId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const toId = asetId.startsWith('entity/') ? asetId : `entity/${asetId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._to == ${toId}
        LET organisasi = DOCUMENT(edge._from)
        RETURN {
          _key: organisasi._key,
          nama: organisasi.nama,
          deskripsi: organisasi.deskripsi,
          relationId: edge._key,
          relationData: edge
        }
      `);
      
      return await cursor.all();
    } catch (error) {
      console.error(`Error fetching organizations for asset ${asetId}:`, error);
      throw error;
    }
  }
  
  /**
   * Cek apakah aset terkait dengan organisasi
   * @param {string} asetId - ID aset
   * @param {string} organisasiId - ID organisasi
   * @returns {Promise<Object>} - OperationResult dengan data isConnected
   */
  async checkAsetInOrganisasi(asetId, organisasiId) {
    if (!this.db) {
      await this.initialize();
    }
    
    try {
      // Pastikan ID dalam format yang benar
      const fromId = organisasiId.startsWith('organisasi/') ? organisasiId : `organisasi/${organisasiId}`;
      const toId = asetId.startsWith('entity/') ? asetId : `entity/${asetId}`;
      
      const collection = await this.getCollection(this.collectionName);
      
      const cursor = await this.db.query(aql`
        FOR edge IN ${collection}
        FILTER edge._from == ${fromId} AND edge._to == ${toId}
        LIMIT 1
        RETURN edge
      `);
      
      const results = await cursor.all();
      const isConnected = results.length > 0;
      
      return {
        success: true,
        message: isConnected 
          ? `Aset ${asetId} terkait dengan organisasi ${organisasiId}` 
          : `Aset ${asetId} tidak terkait dengan organisasi ${organisasiId}`,
        isConnected: isConnected
      };
    } catch (error) {
      console.error(`Error checking if asset ${asetId} is in organization ${organisasiId}:`, error);
      return {
        success: false,
        message: `Gagal memeriksa kaitan: ${error.message}`,
        isConnected: false
      };
    }
  }
}

module.exports = new OrganisasiAsetAPI()