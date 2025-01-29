import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getQuestionnaires } from "../api/questionnaire"
import { createPayment } from "../api/payment"
import { getInvoices } from "../api/invoice"
import { getBillingDetails, updateBillingDetails } from "../api/billing"
import { getSubscription } from "../api/subscription"
import Alert from "../components/Alert"
import { handleApiError, showSuccessNotification } from "../utils/errorHandler"
import DashboardAnalytics from "../components/DashboardAnalytics"
import RecentResponsesWidget from "../components/RecentResponsesWidget"
import PaymentHistory from "../components/PaymentHistory"
import { Loader, PlusCircle, BarChart2, Settings, FileText } from "lucide-react"
import OrderConfirmation from "../components/OrderConfirmation"
import { motion } from "framer-motion"
import { useTheme } from "../contexts/ThemeContext"
import axios from "axios"

interface Questionnaire {
  id: number
  title: string
  created_at: string
}

interface Subscription {
  surveys: number
  expires_at: string
}

interface Invoice {
  id: number
  date: string
  amount: number
  status: string
}

interface BillingDetails {
  company_name: string
  address: string
  city: string
  country: string
  vat_number: string
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    company_name: "",
    address: "",
    city: "",
    country: "",
    vat_number: "",
  })
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false)
  const [selectedSurveys, setSelectedSurveys] = useState(0)
  const [isYearlySubscription, setIsYearlySubscription] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [questionnaireData, subscriptionData, invoicesData, billingDetailsData] = await Promise.all([
          getQuestionnaires(),
          getSubscription(),
          getInvoices(),
          getBillingDetails(),
        ])
        setQuestionnaires(questionnaireData)
        setSubscription(subscriptionData)
        setInvoices(invoicesData)
        setBillingDetails(billingDetailsData)
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const getPriceForSurveys = (surveys: number, isYearly: boolean) => {
    if (isYearly) {
      return surveys * 5 * 12 // 5 euro per maand per survey voor jaarlijks abonnement
    } else {
      return surveys === 1 ? 11 : surveys * 11 // 11 euro per maand voor maandelijks abonnement
    }
  }

  const handleSubscriptionChange = (surveys: number) => {
    setSelectedSurveys(surveys)
    setShowOrderConfirmation(true)
  }

  const handleBillingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateBillingDetails(billingDetails)
      showSuccessNotification("Billing details updated successfully")
    } catch (error) {
      handleApiError(error)
    }
  }

  const handlePayInvoice = async (invoiceId: number) => {
    try {
      const paymentUrl = await createPayment(invoices.find((i) => i.id === invoiceId)?.amount || 0, 0, invoiceId)
      window.location.href = paymentUrl
    } catch (error) {
      handleApiError(error)
    }
  }

  const handleDownloadInvoice = async (invoiceId: number) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/invoices/${invoiceId}/download`, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `invoice-${invoiceId}.pdf`)
      document.body.appendChild(link)
      link.click()
    } catch (error) {
      handleApiError(error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div
      className={`container mx-auto px-4 py-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {alert && <Alert type={alert.type} message={alert.message} />}
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome, {user?.name}
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-semibold mb-2">Active Surveys</h2>
          <p className="text-3xl font-bold">{questionnaires.length}</p>
        </motion.div>
        <motion.div
          className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-semibold mb-2">Total Responses</h2>
          <p className="text-3xl font-bold">1,234</p> {/* Replace with actual data */}
        </motion.div>
        <motion.div
          className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-semibold mb-2">Subscription</h2>
          <p className="text-3xl font-bold">{subscription ? `${subscription.surveys} surveys` : "None"}</p>
        </motion.div>
        <motion.div
          className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 className="text-xl font-semibold mb-2">Next Invoice</h2>
          <p className="text-3xl font-bold">
            {subscription ? new Date(subscription.expires_at).toLocaleDateString() : "N/A"}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <motion.div
            className={`p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <FileText className="mr-2" />
              Your Questionnaires
            </h2>
            <div className="grid gap-4">
              {questionnaires.map((questionnaire) => (
                <motion.div
                  key={questionnaire.id}
                  className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="text-lg font-semibold mb-2">{questionnaire.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Created on: {new Date(questionnaire.created_at).toLocaleDateString()}
                  </p>
                  <Link
                    to={`/questionnaire/${questionnaire.id}`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Edit Questionnaire
                  </Link>
                </motion.div>
              ))}
            </div>
            <Link
              to="/questionnaire"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="mr-2" />
              Create New Questionnaire
            </Link>
          </motion.div>
        </div>
        <div>
          <RecentResponsesWidget />
        </div>
      </div>

      <motion.div
        className={`mb-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <BarChart2 className="mr-2" />
          Analytics Overview
        </h2>
        <DashboardAnalytics />
      </motion.div>

      <div className="mt-8">
        <motion.div
          className={`mb-8 p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <Settings className="mr-2" />
            Subscription Management
          </h2>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={isYearlySubscription}
                onChange={() => setIsYearlySubscription(!isYearlySubscription)}
              />
              <span className="ml-2">Yearly subscription (save up to 45%)</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((surveys) => (
              <div key={surveys} className="border rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {surveys} Survey{surveys > 1 ? "s" : ""}
                  </h3>
                  <p className="text-2xl font-bold">
                    €{getPriceForSurveys(surveys, isYearlySubscription)}/{isYearlySubscription ? "year" : "month"}
                  </p>
                  {isYearlySubscription && (
                    <p className="text-sm text-gray-600">
                      €{(getPriceForSurveys(surveys, isYearlySubscription) / 12).toFixed(2)}/month
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleSubscriptionChange(surveys)}
                  disabled={isProcessingPayment || surveys === subscription?.surveys}
                  className={`mt-4 px-4 py-2 rounded text-white ${
                    surveys === subscription?.surveys
                      ? "bg-green-500"
                      : surveys > (subscription?.surveys || 0)
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                  } transition-colors disabled:opacity-50`}
                >
                  {surveys === subscription?.surveys
                    ? "Current Plan"
                    : surveys > (subscription?.surveys || 0)
                      ? "Upgrade"
                      : "Downgrade"}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <PaymentHistory />

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Billing Information</h2>
        <form onSubmit={handleBillingUpdate} className="space-y-4">
          <div>
            <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              value={billingDetails.company_name}
              onChange={(e) => setBillingDetails({ ...billingDetails, company_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={billingDetails.address}
              onChange={(e) => setBillingDetails({ ...billingDetails, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              type="text"
              id="city"
              value={billingDetails.city}
              onChange={(e) => setBillingDetails({ ...billingDetails, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              value={billingDetails.country}
              onChange={(e) => setBillingDetails({ ...billingDetails, country: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="vat_number" className="block text-sm font-medium text-gray-700">
              VAT Number
            </label>
            <input
              type="text"
              id="vat_number"
              value={billingDetails.vat_number}
              onChange={(e) => setBillingDetails({ ...billingDetails, vat_number: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Update Billing Information
          </button>
        </form>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Invoices</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">€{invoice.amount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{invoice.status}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.status === "unpaid" && (
                    <button
                      onClick={() => handlePayInvoice(invoice.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors mr-2"
                    >
                      Pay Now
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadInvoice(invoice.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OrderConfirmation
        isOpen={showOrderConfirmation}
        onClose={() => setShowOrderConfirmation(false)}
        amount={getPriceForSurveys(selectedSurveys, isYearlySubscription)}
        surveys={selectedSurveys}
        isYearly={isYearlySubscription}
      />
    </div>
  )
}

export default Dashboard

