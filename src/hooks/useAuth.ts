import { useState, useEffect, createContext, useContext } from "react"
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth"

interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiLogin(email, password)
    const user = response.user
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", response.access_token)
  }

  const register = async (name: string, email: string, password: string) => {
    const response = await apiRegister(name, email, password)
    const user = response.user
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
    localStorage.setItem("token", response.access_token)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

