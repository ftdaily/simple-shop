import { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import AuthForm from './AuthForm'
import styles from '../styles/Layout.module.css'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className={styles.unauthorized}>
        <h2>Akses Ditolak</h2>
        <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      </div>
    )
  }

  return <>{children}</>
}