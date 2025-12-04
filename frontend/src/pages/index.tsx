import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import ProductManager from '../components/ProductManager'
import Shop from '../components/Shop'
import TransactionHistory from '../components/TransactionHistory'
// Using emoji icons for now
import axios from 'axios'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [activeTab, setActiveTab] = useState('shop')
  const [products, setProducts] = useState([])
  const { user, logout, isAdmin } = useAuth()

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Head>
          <title>Online Shop - 50423904</title>
          <meta name="description" content="Simple Online Shop - mfarrellr" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🛍️</span>
              <h1>Online Shop by Farrell</h1>
            </div>
            
            <div className={styles.userInfo}>
              <div className={styles.userDetails}>
                <span>👤</span>
                <span>{user?.full_name}</span>
                {isAdmin && <span className={styles.adminBadge}>Admin</span>}
              </div>
              <button onClick={logout} className={styles.logoutButton}>
                <span>🚪</span>
                Keluar
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <nav className={styles.nav}>
            <button 
              className={`${styles.navButton} ${activeTab === 'shop' ? styles.active : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              <span>🛍️</span>
              <span>Belanja</span>
            </button>
            
            {isAdmin && (
              <button 
                className={`${styles.navButton} ${activeTab === 'products' ? styles.active : ''}`}
                onClick={() => setActiveTab('products')}
              >
                <span>⚙️</span>
                <span>Kelola Produk</span>
              </button>
            )}
            
            <button 
              className={`${styles.navButton} ${activeTab === 'history' ? styles.active : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <span>📋</span>
              <span>Riwayat</span>
            </button>
          </nav>

          <div className={styles.content}>
            {activeTab === 'shop' && (
              <Shop products={products} onTransactionComplete={fetchProducts} />
            )}
            {activeTab === 'products' && isAdmin && (
              <ProtectedRoute adminOnly>
                <ProductManager products={products} onProductsChange={fetchProducts} />
              </ProtectedRoute>
            )}
            {activeTab === 'history' && (
              <TransactionHistory />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}