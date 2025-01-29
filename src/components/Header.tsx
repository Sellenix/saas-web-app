import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { useTheme } from "../contexts/ThemeContext"
import { Sun, Moon, User } from "lucide-react"

const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page after logout
      window.location.href = "/"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-white shadow-md dark:bg-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          WebWizardTool
        </Link>
        <nav className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header

