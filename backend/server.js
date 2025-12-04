const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initializeDatabase, initializeTables } = require('./src/config/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database on startup
initializeDatabase()
  .then(() => {
    initializeTables();
    console.log('Database initialized successfully');
    
    const authRoutes = require('./src/routes/auth');
    const productRoutes = require('./src/routes/products');
    const transactionRoutes = require('./src/routes/transactions');
    
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/transactions', transactionRoutes);
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ status: 'Server is running' });
    });
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });