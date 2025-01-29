import type React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth"
import { ThemeProvider } from "./contexts/ThemeContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import QuestionnaireEditor from "./pages/QuestionnaireEditor"
import Profile from "./pages/Profile"
import PublicQuestionnaire from "./pages/PublicQuestionnaire"
import QuestionnaireResults from "./pages/QuestionnaireResults"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/questionnaire/:id?"
                  element={
                    <PrivateRoute>
                      <QuestionnaireEditor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/questionnaire/:id/results"
                  element={
                    <PrivateRoute>
                      <QuestionnaireResults />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route path="/:customUrl" element={<PublicQuestionnaire />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

