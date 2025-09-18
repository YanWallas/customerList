import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import type { JSX } from "react";

export default function ProtectedRoute({children}: { children: JSX.Element }) {
    const user = getCurrentUser();

    const isValidUser = !!user;


  if (!isValidUser) {
      return <Navigate to="/login" replace />;
  }

  return children;
}
