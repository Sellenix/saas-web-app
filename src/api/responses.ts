import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const getRecentResponses = async () => {
  const response = await axios.get(`${API_URL}/responses/recent`)
  return response.data
}

