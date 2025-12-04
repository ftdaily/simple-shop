const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();
const db = getDatabase();

// Get product by filters
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];
  
  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }
  
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  
  query += ' ORDER BY name';
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Create product (ADMIN)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  const { name, description, price, stock, category, image_url } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.query(
    'INSERT INTO products (name, description, price, stock, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description || null, price, stock || 0, category || 'general', image_url || null],
    (err, results) => {
      if (err) {
        console.error('Database error on product insert:', err);
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ 
          id: results.insertId, 
          name,
          description,
          price, 
          stock: stock || 0,
          category: category || 'general',
          image_url,
          message: 'Product created successfully' 
        });
      }
    }
  );
});

// Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, category, image_url } = req.body;

  db.query(
    'UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image_url = ? WHERE id = ?',
    [name, description, price, stock, category, image_url, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});

// Delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  console.log(`Admin ${req.user.username} attempting to delete product ${id}`);
  
  db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      console.log(`Product ${id} not found`);
      res.status(404).json({ error: 'Product not found' });
    } else {
      console.log(`Product ${id} deleted successfully`);
      res.json({ message: 'Product deleted successfully' });
    }
  });
});

// Get categories
router.get('/categories/list', (req, res) => {
  db.query('SELECT DISTINCT category FROM products ORDER BY category', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      const categories = results.map(row => row.category);
      res.json(categories);
    }
  });
});

module.exports = router;
