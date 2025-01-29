import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL

export const getQuestionnaires = async () => {
  const response = await axios.get(`${API_URL}/questionnaires`)
  return response.data
}

export const getQuestionnaire = async (id: number) => {
  const response = await axios.get(`${API_URL}/questionnaires/${id}`)
  return response.data
}

export const saveQuestionnaire = async (questionnaire: any) => {
  if (questionnaire.id) {
    const response = await axios.put(`${API_URL}/questionnaires/${questionnaire.id}`, questionnaire)
    return response.data
  } else {
    const response = await axios.post(`${API_URL}/questionnaires`, questionnaire)
    return response.data
  }
}

export const deleteQuestionnaire = async (id: number) => {
  const response = await axios.delete(`${API_URL}/questionnaires/${id}`)
  return response.data
}

