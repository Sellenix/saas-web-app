import type React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface AdminRouteProps {
  component: React.ComponentType<any>
  path: string
}

const AdminRoute: React.FC<AdminRouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useAuth()

  return (
    <Route
      {...rest}
      render={(props) => (user && user.role === "admin" ? <Component {...props} /> : <Navigate to="/" replace />)}
    />
  )
}

export default AdminRoute

