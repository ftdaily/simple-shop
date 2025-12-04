const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { generateQRCode } = require('../utils/qrcode');

const router = express.Router();
const db = getDatabase();

// Get all transactions (User only see their, admin sees all)
router.get('/', authenticateToken, (req, res) => {
  let query = `
    SELECT t.*, u.username, u.full_name, ti.product_id, ti.quantity, ti.price as item_price, p.name as product_name
    FROM transactions t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN products p ON ti.product_id = p.id
  `;
  
  const params = [];
  
  // If not admin, only show user's own transactions
  if (req.user.role !== 'admin') {
    query += ' WHERE t.user_id = ?';
    params.push(req.user.id);
  }
  
  query += ' ORDER BY t.created_at DESC';
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Group transaction items by transaction
      const transactions = {};
      results.forEach(row => {
        if (!transactions[row.id]) {
          transactions[row.id] = {
            id: row.id,
            user_id: row.user_id,
            username: row.username,
            full_name: row.full_name,
            total_amount: row.total_amount,
            payment_method: row.payment_method,
            payment_status: row.payment_status,
            created_at: row.created_at,
            items: []
          };
        }
        if (row.product_id) {
          transactions[row.id].items.push({
            product_id: row.product_id,
            product_name: row.product_name,
            quantity: row.quantity,
            price: row.item_price
          });
        }
      });
      res.json(Object.values(transactions));
    }
  });
});

// Create transaction
router.post('/', authenticateToken, async (req, res) => {
  const { items, payment_method = 'qris' } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Transaction items are required' });
  }

  const total_amount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  
  // Generate QR code for QRIS payment mockup
  let qr_code = null;
  if (payment_method === 'qris') {
    try {
      qr_code = await generateQRCode({ amount: total_amount });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insert transaction with completed status for mockup
    db.query(
      'INSERT INTO transactions (user_id, total_amount, payment_method, payment_status, qr_code) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, total_amount, payment_method, 'completed', qr_code],
      (err, results) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        const transaction_id = results.insertId;

        // Insert transaction items
        const itemQueries = items.map(item => 
          new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO transaction_items (transaction_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
              [transaction_id, item.product_id, item.quantity, item.price],
              (err) => {
                if (err) reject(err);
                else {
                  // Update product stock
                  db.query(
                    'UPDATE products SET stock = stock - ? WHERE id = ?',
                    [item.quantity, item.product_id],
                    (err) => {
                      if (err) reject(err);
                      else resolve();
                    }
                  );
                }
              }
            );
          })
        );

        Promise.all(itemQueries)
          .then(() => {
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              }
              res.status(201).json({ 
                id: transaction_id, 
                total_amount,
                payment_method,
                qr_code,
                message: 'Transaction created successfully' 
              });
            });
          })
          .catch((err) => {
            db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          });
      }
    );
  });
});

// Confirm payment (simulate payment completion)
router.post('/:id/confirm', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  let query = 'UPDATE transactions SET payment_status = "completed" WHERE id = ?';
  const params = [id];
  
  // If not admin, only allow user to confirm their own transactions
  if (req.user.role !== 'admin') {
    query += ' AND user_id = ?';
    params.push(req.user.id);
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Transaction not found or unauthorized' });
    } else {
      res.json({ message: 'Payment confirmed successfully' });
    }
  });
});

module.exports = router;
