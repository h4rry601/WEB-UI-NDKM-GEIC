import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import gsafeLogo from '../assets/images/logo Gsafe.png'
import './Login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const result = login(username.trim(), password, remember)
    if (result.success) {
      setError(null)
      navigate('/dashboard', { state: { fromLogin: true } })
    } else if (result.message) {
      setError(result.message)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">
          <img src={gsafeLogo} alt="GSafe logo" className="gsafe-logo-image" />
          <div className="logo-subtitle">
          </div>
        </div>
        
        <h1 className="login-title">ĐĂNG NHẬP</h1>
        <p className="login-instruction">Vui lòng đăng nhập thông tin ở dưới đây</p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập *</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember">Ghi nhớ đăng nhập</label>
          </div>
          
          <button type="submit" className="login-button">
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

