import type React from "react"

interface AlertProps {
  type: "success" | "error" | "info"
  message: string
}

const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const bgColor = type === "success" ? "bg-green-100" : type === "error" ? "bg-red-100" : "bg-blue-100"
  const textColor = type === "success" ? "text-green-700" : type === "error" ? "text-red-700" : "text-blue-700"
  const borderColor = type === "success" ? "border-green-400" : type === "error" ? "border-red-400" : "border-blue-400"

  return (
    <div className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded relative`} role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  )
}

export default Alert

