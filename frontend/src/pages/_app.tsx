import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastProvider } from '../contexts/ToastContext'
import { ConfirmProvider } from '../contexts/ConfirmContext'
import ToastContainer from '../components/ToastContainer'
import axios from 'axios'
import Cookies from 'js-cookie'

axios.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfirmProvider>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Component {...pageProps} />
        </AuthProvider>
      </ToastProvider>
    </ConfirmProvider>
  )
}