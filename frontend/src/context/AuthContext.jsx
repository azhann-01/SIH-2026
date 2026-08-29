import { createContext, useContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    })

    const data = response.data
    const token = data.token

    if (!token) {
      throw new Error('No token received from server')
    }

    localStorage.setItem('auth_token', token)

    const savedUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role
    }

    localStorage.setItem('user', JSON.stringify(savedUser))
    setUser(savedUser)

    return data
  }

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password
    })

    return response.data
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)