import { useState, useEffect } from 'react'
import styles from '../styles/QRModal.module.css'

interface QRModalProps {
  qrCode: string
  total: number
  onClose: () => void
  onPaymentComplete: () => void
}

export default function QRModal({ qrCode, total, onClose, onPaymentComplete }: QRModalProps) {
  const [countdown, setCountdown] = useState(3)
  const [isCompleting, setIsCompleting] = useState(false)

  useEffect(() => {
    // Auto-complete payment after 3 seconds for mockup
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleAutoComplete = () => {
    setIsCompleting(true)
    setTimeout(() => {
      onPaymentComplete()
    }, 1000)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>QRIS Payment</h3>
          <button onClick={onClose} className={styles.closeButton}>X</button>
        </div>

        <div className={styles.paymentInfo}>
          <div className={styles.totalAmount}>
            <strong>Rp {total.toLocaleString()}</strong>
          </div>
          <p>Scan QR Code di bawah dengan aplikasi mobile banking atau e-wallet Anda</p>
        </div>

        <div className={styles.qrContainer}>
          <img src={qrCode} alt="QR Code" className={styles.qrCode} />
        </div>

        <div className={styles.statusContainer}>
          {countdown > 0 && !isCompleting ? (
            <div className={styles.waiting}>
              <div className={styles.loader}></div>
              <p>Menunggu pembayaran...</p>
              <p className={styles.countdown}>Auto-complete dalam {countdown} detik (mockup)</p>
            </div>
          ) : isCompleting ? (
            <div className={styles.completing}>
              <div className={styles.successIcon}>OK</div>
              <p>Pembayaran berhasil!</p>
            </div>
          ) : null}
        </div>

        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}