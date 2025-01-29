import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import ChangePassword from "../components/ChangePassword"
import DeleteAccount from "../components/DeleteAccount"
import { getBillingDetails, updateBillingDetails } from "../api/billing"
import { handleApiError, showSuccessNotification } from "../utils/errorHandler"
import { Loader } from "lucide-react"

const Profile: React.FC = () => {
  const { user } = useAuth()
  const [billingDetails, setBillingDetails] = useState({
    company_name: "",
    address: "",
    city: "",
    country: "",
    vat_number: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBillingDetails = async () => {
      try {
        setIsLoading(true)
        const data = await getBillingDetails()
        setBillingDetails(data)
      } catch (error) {
        handleApiError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBillingDetails()
  }, [])

  const handleBillingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateBillingDetails(billingDetails)
      showSuccessNotification("Billing details updated successfully")
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Account Information</h2>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <ChangePassword />
        </div>
      </div>
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
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Danger Zone</h2>
        <DeleteAccount />
      </div>
    </div>
  )
}

export default Profile

