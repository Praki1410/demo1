const { pool } = require('../config/db');

class Product {
  static async create(productData) {
    try {
      const { user_id, name, price, image } = productData;
      
      const [result] = await pool.query(
        'INSERT INTO products (user_id, name, price, image) VALUES (?, ?, ?, ?)',
        [user_id, name, price, image]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  
  static async findByUserId(userId) {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE user_id = ?', [userId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
      return rows;
    } catch (error) {
      throw error;
    }
  }
  
  static async update(id, productData) {
    try {
      const { name, price, image } = productData;
      
      const [result] = await pool.query(
        'UPDATE products SET name = ?, price = ?, image = ? WHERE id = ?',
        [name, price, image, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  static async isOwner(productId, userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM products WHERE id = ? AND user_id = ?',
        [productId, userId]
      );
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;