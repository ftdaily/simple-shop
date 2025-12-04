import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import PaymentModal from './PaymentModal'
import QRModal from './QRModal'
import axios from 'axios'
import styles from '../styles/Shop.module.css'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  image_url?: string
}

interface CartItem {
  product: Product
  quantity: number
}

interface ShopProps {
  products: Product[]
  onTransactionComplete: () => void
}

export default function Shop({ products, onTransactionComplete }: ShopProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [qrCodeData, setQrCodeData] = useState({ qrCode: '', total: 0 })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { addToast } = useToast()

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.stock > 0
  })

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        addToast('Stok tidak mencukupi!', 'warning')
      }
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.product.id !== productId))
    } else {
      const product = products.find(p => p.id === productId)
      if (product && quantity <= product.stock) {
        setCart(cart.map(item =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
        ))
      } else {
        addToast('Stok tidak mencukupi!', 'warning')
      }
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handleCheckout = () => {
    if (cart.length === 0) {
      addToast('Keranjang kosong!', 'warning')
      return
    }
    setShowPaymentModal(true)
  }

  const handlePaymentComplete = async (paymentMethod: string) => {
    setLoading(true)
    
    const transactionItems = cart.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }))

    try {
      const response = await axios.post('/api/transactions', { 
        items: transactionItems,
        payment_method: paymentMethod
      })

      if (response.status === 201) {
        setShowPaymentModal(false)
        
        // Show different UI based on payment method
        if (paymentMethod === 'qris' && response.data.qr_code) {
          // Show QR modal for QRIS payments
          setQrCodeData({ 
            qrCode: response.data.qr_code, 
            total: response.data.total_amount 
          })
          setShowQRModal(true)
        } else {
          // Complete immediately for cash payments
          setCart([])
          onTransactionComplete()
          addToast('Pembayaran Cash berhasil! Transaksi telah selesai.', 'success')
        }
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      addToast('Terjadi kesalahan saat memproses transaksi', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleQRPaymentComplete = () => {
    setCart([])
    setShowQRModal(false)
    onTransactionComplete()
    addToast('Pembayaran QRIS berhasil! Transaksi telah selesai.', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.shopHeader}>
        <h2>Selamat Berbelanja, {user?.full_name}!</h2>
        <p>Temukan produk terbaik dengan harga terjangkau</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.categoryFilter}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Semua Kategori' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.shopContent}>
        <div className={styles.productsSection}>
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.productImage}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <div className={styles.noImage}>📦</div>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <div className={styles.productPrice}>
                    Rp {product.price.toLocaleString()}
                  </div>
                  <div className={styles.productStock}>
                    Stok: {product.stock}
                  </div>
                  <button
                    onClick={() => addToCart(product)}
                    className={styles.addToCartButton}
                    disabled={product.stock === 0}
                  >
                    🛒 Tambah ke Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.cartSection}>
          <div className={styles.cartHeader}>
            <h3>🛍️ Keranjang Belanja</h3>
            <span className={styles.cartCount}>({cart.length})</span>
          </div>
          
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Keranjang masih kosong</p>
              <small>Tambahkan produk untuk mulai berbelanja</small>
            </div>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cart.map((item) => (
                  <div key={item.product.id} className={styles.cartItem}>
                    <div className={styles.cartItemInfo}>
                      <h4>{item.product.name}</h4>
                      <p>Rp {item.product.price.toLocaleString()}</p>
                    </div>
                    <div className={styles.cartItemControls}>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className={styles.quantityButton}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className={styles.removeButton}
                      >
                        🗑️
                      </button>
                    </div>
                    <div className={styles.itemTotal}>
                      Rp {(item.product.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartSummary}>
                <div className={styles.totalAmount}>
                  <strong>Total: Rp {getTotalAmount().toLocaleString()}</strong>
                </div>
                <button
                  onClick={handleCheckout}
                  className={styles.checkoutButton}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '💳 Checkout'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal
          total={getTotalAmount()}
          onPayment={handlePaymentComplete}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
      
      {showQRModal && (
        <QRModal
          qrCode={qrCodeData.qrCode}
          total={qrCodeData.total}
          onClose={() => setShowQRModal(false)}
          onPaymentComplete={handleQRPaymentComplete}
        />
      )}
    </div>
  )
}