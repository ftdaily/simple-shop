const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();
const db = getDatabase();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, full_name } = req.body;
  
  if (!username || !email || !password || !full_name) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, 'user'],
      (err, results) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        
        const token = jwt.sign(
          { id: results.insertId, username, role: 'user' },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.status(201).json({ 
          message: 'User registered successfully',
          token,
          user: { id: results.insertId, username, full_name, role: 'user' }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      
      const user = results[0];
      
      try {
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const token = jwt.sign(
          { id: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        
        res.json({
          message: 'Login successful',
          token,
          user: { 
            id: user.id, 
            username: user.username, 
            full_name: user.full_name, 
            role: user.role 
          }
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  );
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  db.query(
    'SELECT id, username, email, full_name, role FROM users WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(results[0]);
    }
  );
});

module.exports = router;
