import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import axios from 'axios'
import styles from '../styles/TransactionHistory.module.css'

interface TransactionItem {
  product_id: number
  product_name: string
  quantity: number
  price: number
}

interface Transaction {
  id: number
  user_id: number
  username?: string
  full_name?: string
  total_amount: number
  payment_method: string
  payment_status: string
  created_at: string
  items: TransactionItem[]
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { user, isAdmin } = useAuth()
  const { addToast } = useToast()

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions')
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmPayment = async (transactionId: number) => {
    try {
      await axios.post(`/api/transactions/${transactionId}/confirm`)
      fetchTransactions()
      addToast('Pembayaran berhasil dikonfirmasi!', 'success')
    } catch (error) {
      console.error('Error confirming payment:', error)
      addToast('Terjadi kesalahan saat konfirmasi pembayaran', 'error')
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID')
  }

  if (loading) {
    return <div className={styles.loading}>Memuat riwayat transaksi...</div>
  }

  return (
    <div className={styles.container}>
      <h2>Riwayat Transaksi</h2>
      
      {transactions.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>□</span>
          <p>Belum ada transaksi</p>
          <small>Transaksi yang telah dilakukan akan muncul di sini</small>
        </div>
      ) : (
        <div className={styles.transactionList}>
          {transactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionCard}>
              <div className={styles.transactionHeader}>
                <div className={styles.transactionInfo}>
                  <h3>Transaksi #{transaction.id}</h3>
                  <p>{formatDate(transaction.created_at)}</p>
                  {isAdmin && transaction.full_name && (
                    <p><strong>Customer:</strong> {transaction.full_name}</p>
                  )}
                </div>
                <div className={styles.transactionStatus}>
                  <div className={styles.total}>
                    <strong>Rp {transaction.total_amount.toLocaleString()}</strong>
                  </div>
                  <div className={styles.paymentInfo}>
                    <span className={styles.paymentMethod}>
                      {transaction.payment_method === 'qris' ? 'QRIS' : 'Cash'}
                    </span>
                    <span className={`${styles.status} ${styles[transaction.payment_status]}`}>
                      {transaction.payment_status === 'pending' ? 'Menunggu' : 
                       transaction.payment_status === 'completed' ? 'Selesai' : 'Gagal'}
                    </span>
                  </div>
                  {transaction.payment_status === 'pending' && (
                    <button 
                      onClick={() => confirmPayment(transaction.id)}
                      className={styles.confirmButton}
                    >
                      Konfirmasi Pembayaran
                    </button>
                  )}
                </div>
              </div>
              
              <div className={styles.transactionItems}>
                <h4>Detail Produk:</h4>
                <div className={styles.itemsGrid}>
                  {transaction.items.map((item, index) => (
                    <div key={index} className={styles.item}>
                      <span className={styles.itemName}>{item.product_name}</span>
                      <span className={styles.itemQuantity}>{item.quantity}x</span>
                      <span className={styles.itemPrice}>Rp {item.price.toLocaleString()}</span>
                      <span className={styles.itemTotal}>Rp {(item.quantity * item.price).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}