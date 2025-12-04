import { createContext, useContext, useState, ReactNode } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  login: (
    username: string,
    password: string,
    remember: boolean,
  ) => { success: boolean; message?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEFAULT_USERNAME = 'admin'
const DEFAULT_PASSWORD = 'Geic@2025'
const MAX_FAILED_ATTEMPTS = 5
const LOCK_TIME_MS = 5 * 60 * 1000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    const stored = localStorage.getItem('failedAttempts')
    return stored ? Number(stored) : 0
  })

  const [lockUntil, setLockUntil] = useState<number | null>(() => {
    const stored = localStorage.getItem('lockUntil')
    return stored ? Number(stored) : null
  })

  const login = (
    username: string,
    password: string,
    remember: boolean,
  ): { success: boolean; message?: string } => {
    const now = Date.now()

    if (lockUntil && now < lockUntil) {
      const remainingMs = lockUntil - now
      const remainingMinutes = Math.ceil(remainingMs / 60000)
      return {
        success: false,
        message: `Tài khoản đã bị khóa. Vui lòng thử lại sau khoảng ${remainingMinutes} phút.`,
      }
    }

    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
      setIsAuthenticated(true)
      setFailedAttempts(0)
      setLockUntil(null)
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('username', username)
      localStorage.setItem('failedAttempts', '0')
      localStorage.removeItem('lockUntil')

      if (remember) {
        localStorage.setItem('rememberLogin', 'true')
      } else {
        localStorage.removeItem('rememberLogin')
      }

      return { success: true }
    }

    const newFailedAttempts = failedAttempts + 1
    setFailedAttempts(newFailedAttempts)
    localStorage.setItem('failedAttempts', String(newFailedAttempts))

    if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      const newLockUntil = now + LOCK_TIME_MS
      setLockUntil(newLockUntil)
      localStorage.setItem('lockUntil', String(newLockUntil))
      return {
        success: false,
        message:
          'Bạn đã nhập sai tài khoản hoặc mật khẩu quá 5 lần. Tài khoản tạm thời bị khóa trong 5 phút.',
      }
    }

    const remaining = MAX_FAILED_ATTEMPTS - newFailedAttempts
    return {
      success: false,
      message: `Tài khoản hoặc mật khẩu không đúng. Bạn còn ${remaining} lần thử trước khi bị khóa.`,
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('rememberLogin')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

