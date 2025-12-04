import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'
import styles from '../styles/Cashier.module.css'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface CartItem {
  product: Product
  quantity: number
}

interface CashierProps {
  products: Product[]
  onTransactionComplete: () => void
}

export default function Cashier({ products, onTransactionComplete }: CashierProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { addToast } = useToast()

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    product.stock > 0
  )

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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast('Keranjang kosong!', 'warning')
      return
    }

    const transactionItems = cart.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }))

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: transactionItems }),
      })

      if (response.ok) {
        setCart([])
        onTransactionComplete()
        addToast('Transaksi berhasil!', 'success')
      } else {
        addToast('Terjadi kesalahan saat memproses transaksi', 'error')
      }
    } catch (error) {
      console.error('Error:', error)
      addToast('Terjadi kesalahan saat memproses transaksi', 'error')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.productsSection}>
        <h2>Produk</h2>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <h3>{product.name}</h3>
              <p>Rp {product.price.toLocaleString()}</p>
              <p>Stok: {product.stock}</p>
              <button
                onClick={() => addToCart(product)}
                className={styles.addButton}
                disabled={product.stock === 0}
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.cartSection}>
        <h2>Keranjang</h2>
        {cart.length === 0 ? (
          <p>Keranjang kosong</p>
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
                      -
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
                      Hapus
                    </button>
                  </div>
                  <div className={styles.itemTotal}>
                    Rp {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.cartSummary}>
              <div className={styles.total}>
                <strong>Total: Rp {getTotalAmount().toLocaleString()}</strong>
              </div>
              <button
                onClick={handleCheckout}
                className={styles.checkoutButton}
              >
                Bayar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}