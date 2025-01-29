import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const getSubscription = async () => {
  const response = await axios.get(`${API_URL}/subscription`)
  return response.data
}

export const downgradeSubscription = async (surveys: number) => {
  const response = await axios.put(`${API_URL}/subscription/downgrade`, { surveys })
  return response.data
}

