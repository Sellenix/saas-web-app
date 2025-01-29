import type React from "react"
import { useState } from "react"
import { deleteAccount } from "../api/auth"
import { showErrorNotification, handleApiError } from "../utils/errorHandler"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

const DeleteAccount: React.FC = () => {
  const [reason, setReason] = useState("")
  const [isConfirming, setIsConfirming] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirming(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteAccount(reason)
      await logout()
      navigate("/")
    } catch (error) {
      handleApiError(error)
    }
  }

  if (isConfirming) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Warning!</strong>
        <p className="block sm:inline"> This action cannot be undone. Are you sure you want to delete your account?</p>
        <div className="mt-4">
          <button
            onClick={confirmDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Yes, delete my account
          </button>
          <button
            onClick={() => setIsConfirming(false)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
          Why do you want to leave? (Optional)
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Delete Account
      </button>
    </form>
  )
}

export default DeleteAccount

