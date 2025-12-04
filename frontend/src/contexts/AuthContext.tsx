import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'

interface User {
  id: number
  username: string
  full_name: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string, full_name: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = Cookies.get('auth_token')
    if (savedToken) {
      setToken(savedToken)
      fetchUser(savedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/login', { username, password })
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      Cookies.set('auth_token', newToken, { expires: 1 }) // 1 day
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string, full_name: string): Promise<boolean> => {
    try {
      const response = await axios.post('/api/auth/register', { username, email, password, full_name })
      const { token: newToken, user: userData } = response.data
      
      setToken(newToken)
      setUser(userData)
      Cookies.set('auth_token', newToken, { expires: 1 })
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    Cookies.remove('auth_token')
  }

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      loading,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  )
}