import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = login(email, password)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>СистемаКонтроля</h1>
        <p>Войдите в систему управления строительными дефектами</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Введите ваш email"
            />
          </div>
          
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Демо доступы:</h3>
          <p>Менеджер: manager@system.ru / 123</p>
          <p>Инженер: engineer@system.ru / 123</p>
          <p>Наблюдатель: observer@system.ru / 123</p>
        </div>
      </div>
    </div>
  )
}

export default Login