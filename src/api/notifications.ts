import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`)
  return response.data
}

export const markNotificationAsRead = async (id: number) => {
  const response = await axios.put(`${API_URL}/notifications/${id}/read`)
  return response.data
}

