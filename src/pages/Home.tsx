import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTheme } from "../contexts/ThemeContext"
import { Sun, Moon, ChevronRight } from "lucide-react"
import FAQ from "../components/FAQ"

const Home: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")
    if (!hasVisitedBefore) {
      setShowWelcome(true)
      localStorage.setItem("hasVisitedBefore", "true")
    }
  }, [])

  return (
    <div
      className={`min-h-screen flex flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <nav className="py-6 px-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          WebWizardTool
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"}`}
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            to="/login"
            className={`px-4 py-2 rounded-full ${theme === "dark" ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition-colors`}
          >
            Login
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {showWelcome && (
          <div className={`mb-8 p-4 rounded-lg ${theme === "dark" ? "bg-blue-900" : "bg-blue-100"}`}>
            <h2 className="text-xl font-semibold mb-2">Welcome to WebWizardTool!</h2>
            <p>Create and manage surveys with ease. Get started by signing up or exploring our features.</p>
          </div>
        )}

        <h1 className="text-5xl sm:text-6xl font-extrabold text-center mb-8">
          Create Surveys <span className={`${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>Instantly</span>
        </h1>
        <p className="text-xl text-center mb-12 max-w-2xl">
          Launch your survey in minutes. No coding required. Just sign up and start creating.
        </p>
        <Link
          to="/register"
          className={`group inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-sm ${
            theme === "dark" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
          } transition-colors`}
        >
          Get Started
          <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
        </Link>
      </main>

      <section className={`py-16 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-8">Pricing</h2>
          <div className="mt-8 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-2">
            <div
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${
                theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium">Monthly Plan</h3>
                <p className="mt-4 text-3xl font-extrabold">€11</p>
                <p className="mt-1 text-sm">per month per survey</p>
              </div>
              <div className="pt-6 pb-8 px-6">
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Flexible monthly billing</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
              </div>
            </div>
            <div
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 ${
                theme === "dark" ? "bg-gray-700 border-gray-600" : "bg-white"
              }`}
            >
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium">Yearly Plan</h3>
                <p className="mt-4 text-3xl font-extrabold">€5</p>
                <p className="mt-1 text-sm">per month per survey, billed annually</p>
              </div>
              <div className="pt-6 pb-8 px-6">
                <ul className="mt-6 space-y-4">
                  <li className="flex space-x-3">
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Save up to 45%</span>
                  </li>
                  <li className="flex space-x-3">
                    <svg
                      className={`flex-shrink-0 h-5 w-5 ${theme === "dark" ? "text-green-400" : "text-green-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Best value for long-term use</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-sectie */}
      <FAQ />

      <footer className={`py-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base">© 2023 WebWizardTool. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

