import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL
const IS_TEST_MODE = process.env.REACT_APP_TEST_MODE === "true"
const TEST_PAYMENT_LINK = "https://payment-links.mollie.com/payment/KtERDXYkS2hry94GxyrQe"

export const createPayment = async (amount: number, surveys: number, invoiceId?: number, acceptedTerms = false) => {
  try {
    console.log("Creating payment:", { amount, surveys, invoiceId, acceptedTerms })

    if (IS_TEST_MODE) {
      console.log("Test mode: Returning test payment link")
      return TEST_PAYMENT_LINK
    }

    const response = await axios.post(`${API_URL}/payments`, { amount, surveys, invoiceId, acceptedTerms })
    console.log("Payment created:", response.data)
    return response.data.payment_url
  } catch (error) {
    console.error("Payment creation failed:", error)
    throw error
  }
}

