import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const updateProfile = async (userData: { name: string; email: string }) => {
  const response = await axios.put(`${API_URL}/user`, userData)
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

