import { useToast } from '../contexts/ToastContext'
import styles from '../styles/Toast.module.css'

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.content}>
            <span className={styles.icon}>
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✗'}
              {toast.type === 'warning' && '!'}
              {toast.type === 'info' && 'i'}
            </span>
            <p>{toast.message}</p>
          </div>
          <button 
            className={styles.close}
            onClick={() => removeToast(toast.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
