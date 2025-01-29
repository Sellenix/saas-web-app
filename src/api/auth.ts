import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  return response.data
}

export const register = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password })
  return response.data
}

export const logout = async () => {
  const response = await axios.post(`${API_URL}/logout`)
  return response.data
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axios.put(`${API_URL}/user/password`, {
    current_password: currentPassword,
    password: newPassword,
    password_confirmation: newPassword,
  })
  return response.data
}

export const deleteAccount = async (reason: string) => {
  const response = await axios.delete(`${API_URL}/user`, { data: { reason } })
  return response.data
}

