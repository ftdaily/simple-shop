const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

let db;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    const initialDb = mysql.createConnection(dbConfig);

    initialDb.connect((err) => {
      if (err) {
        console.error('Initial database connection failed:', err.message);
        return reject(err);
      }

      const dbName = process.env.DB_NAME || 'simple_cashier';
      initialDb.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, (err) => {
        if (err) {
          console.error('Error creating database:', err.message);
          return reject(err);
        }

        console.log(`Database '${dbName}' ready`);
        initialDb.end();

        // Now connect to the actual database
        db = mysql.createConnection({
          host: process.env.DB_HOST || 'localhost',
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'dbWebUjian'
        });

        db.connect((err) => {
          if (err) {
            console.error('Database connection failed:', err.message);
            return reject(err);
          } else {
            console.log('Connected to MySQL database');
            resolve();
          }
        });

        // DB Error handler
        db.on('error', (err) => {
          console.error('Database error:', err);
        });
      });
    });
  });
};

const initializeTables = () => {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      stock INT DEFAULT 0,
      category VARCHAR(100) DEFAULT 'general',
      image_url VARCHAR(500) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total_amount DECIMAL(10, 2) NOT NULL,
      payment_method ENUM('qris', 'cash') DEFAULT 'qris',
      payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
      qr_code TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS transaction_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      transaction_id INT,
      product_id INT,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`
  ];

  tables.forEach(sql => {
    db.query(sql, (err) => {
      if (err) console.error('Error creating table:', err);
    });
  });
};

const getDatabase = () => db;

module.exports = {
  initializeDatabase,
  initializeTables,
  getDatabase
};
