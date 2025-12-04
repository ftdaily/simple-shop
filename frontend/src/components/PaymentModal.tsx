import { useState } from 'react'
import styles from '../styles/PaymentModal.module.css'

interface PaymentModalProps {
  total: number
  onPayment: (paymentMethod: string) => void
  onClose: () => void
}

export default function PaymentModal({ total, onPayment, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('qris')
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    await onPayment(selectedMethod)
    setLoading(false)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Payment Method Selection</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.totalSection}>
          <div className={styles.totalAmount}>
            Total Pembayaran: <strong>Rp {total.toLocaleString()}</strong>
          </div>
        </div>

        <div className={styles.paymentMethods}>
          <div className={styles.paymentOption}>
            <label className={styles.paymentLabel}>
              <input
                type="radio"
                name="paymentMethod"
                value="qris"
                checked={selectedMethod === 'qris'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <div className={styles.paymentInfo}>
                <div className={styles.paymentIcon}>□</div>
                <div className={styles.paymentDetails}>
                  <h4>QRIS</h4>
                  <p>Bayar dengan scan QR Code</p>
                  <span className={styles.recommended}>Direkomendasikan</span>
                </div>
              </div>
            </label>
          </div>

          <div className={styles.paymentOption}>
            <label className={styles.paymentLabel}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={selectedMethod === 'cash'}
                onChange={(e) => setSelectedMethod(e.target.value)}
              />
              <div className={styles.paymentInfo}>
                <div className={styles.paymentIcon}>$</div>
                <div className={styles.paymentDetails}>
                  <h4>Cash</h4>
                  <p>Bayar dengan uang tunai</p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {selectedMethod === 'qris' && (
          <div className={styles.qrisInfo}>
            <div className={styles.qrisIcon}>↻</div>
            <p>Setelah checkout, Anda akan mendapatkan QR Code untuk melakukan pembayaran melalui aplikasi e-wallet atau mobile banking.</p>
          </div>
        )}

        <div className={styles.modalActions}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handlePayment}
            className={styles.payButton}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Bayar Rp ${total.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  )
}