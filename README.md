# Shopping Web Application

Aplikasi toko sederhana berbasis web dengan menggunakan  **Next.js**, **Express.js**, dan **MySQL**. Fitur CRUD untuk manajemen produk, mockup payment, dan riwayat transaksi.

## Techstack

### Frontend
- **Next.js 14** - React framework untuk server-side rendering
- **React 18** - Library JavaScript untuk UI
- **TypeScript** - Type-safe JavaScript
- **CSS Modules** - Styling dengan scoped CSS

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework untuk Node.js
- **MySQL** - Relational database
- **CORS** - Cross-origin resource sharing



## Skema DB

### Products
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `name` (VARCHAR(255), NOT NULL)
- `price` (DECIMAL(10,2), NOT NULL)
- `stock` (INT, DEFAULT 0)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Transactions
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `total_amount` (DECIMAL(10,2), NOT NULL)
- `created_at` (TIMESTAMP)

### Transaction Items
- `id` (INT, AUTO_INCREMENT, PRIMARY KEY)
- `transaction_id` (INT, FOREIGN KEY)
- `product_id` (INT, FOREIGN KEY)
- `quantity` (INT, NOT NULL)
- `price` (DECIMAL(10,2), NOT NULL)

## Setup

### Dependencies
- Node.js (versi 18 atau lebih baru)
- MySQL Server
- npm atau yarn

### 1. Database MySQL

1. import ```simple_cashier.sql``` ke MySQL

### 2. Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Rename ```.env.example``` menjadi ```.env``` lalu masukkan konfigurasi database.

3. Edit file `.env` dengan konfigurasi database Anda:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=simple_cashier
   PORT=5000
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

### 3. Frontend

1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Run

1. **Jalankan Backend Server:**
   ```bash
   node .
   ```
   Server akan berjalan di `http://localhost:5000`

2. **Jalankan Frontend Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`


## Fitur

### 1. Halaman Produk
- Menampilkan daftar produk yang tersedia
- Pencarian produk
- Keranjang produk
- Atur jumlah produk di keranjang
- Kalkulasi total otomatis
- Proses checkout dan pembayaran

### 2. CRUD Produk
- **Create**: Tambah produk baru
- **Read**: Lihat daftar semua produk
- **Update**: Edit informasi produk
- **Delete**: Hapus produk

### 3. History Transaksi
- Lihat semua transaksi yang pernah dilakukan
- Detail produk dalam setiap transaksi
- Timestamp transaksi
- Total amount per transaksi

## API Endpoints

### Products
- `GET /api/products` - Ambil semua produk
- `GET /api/products/:id` - Ambil produk berdasarkan ID
- `POST /api/products` - Tambah produk baru
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### Transactions
- `GET /api/transactions` - Ambil semua transaksi
- `POST /api/transactions` - Buat transaksi baru

