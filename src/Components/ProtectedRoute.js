import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect them to the SignIn page
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
