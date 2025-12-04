import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from '../styles/Auth.module.css'

interface AuthFormProps {
  onClose?: () => void
}

export default function AuthForm({ onClose }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let success = false
      
      if (isLogin) {
        success = await login(formData.username, formData.password)
      } else {
        success = await register(formData.username, formData.email, formData.password, formData.full_name)
      }
      
      if (success) {
        onClose?.()
      } else {
        setError(isLogin ? 'Login gagal. Periksa username dan password.' : 'Registrasi gagal. Coba lagi.')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h2>{isLogin ? 'Masuk' : 'Daftar Akun'}</h2>
          {onClose && (
            <button onClick={onClose} className={styles.closeButton}>X</button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          {!isLogin && (
            <>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </>
          )}
          
          <div className={styles.formGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Loading...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>
        
        <div className={styles.authSwitch}>
          <p>
            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={styles.switchButton}
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}