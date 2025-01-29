import { toast } from "react-toastify"

export const logError = (error: Error, context: Record<string, any> = {}) => {
  console.error("Error occurred:", error.message, context)
  // Here you would typically send this error to your error tracking service
  // For example: Sentry.captureException(error, { extra: context });
}

export const showErrorNotification = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })
}

export const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    showErrorNotification(error.response.data.message || "An error occurred. Please try again.")
    logError(new Error(error.response.data.message), { status: error.response.status })
  } else if (error.request) {
    // The request was made but no response was received
    showErrorNotification("No response received from server. Please check your internet connection.")
    logError(new Error("No response received"), { request: error.request })
  } else {
    // Something happened in setting up the request that triggered an Error
    showErrorNotification("An unexpected error occurred. Please try again.")
    logError(error)
  }
}

