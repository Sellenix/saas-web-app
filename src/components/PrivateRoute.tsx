import type React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface PrivateRouteProps {
  component: React.ComponentType<any>
  path: string
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useAuth()

  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Navigate to="/login" replace />)} />
}

export default PrivateRoute

