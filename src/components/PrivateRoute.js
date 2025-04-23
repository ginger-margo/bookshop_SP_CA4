// Proxy Pattern: This component acts as a gatekeeper, controlling access to protected routes based on authentication and user role

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, adminOnly = false }) {
  const { currentUser } = useAuth();

  // if not logged in - send user to login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // if the page is for admin only and user is not admin send to main
  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/" />; 
  }

  return children;
}
