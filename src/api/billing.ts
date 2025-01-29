import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const getBillingDetails = async () => {
  const response = await axios.get(`${API_URL}/billing`)
  return response.data
}

export const updateBillingDetails = async (billingDetails: any) => {
  const response = await axios.put(`${API_URL}/billing`, billingDetails)
  return response.data
}

