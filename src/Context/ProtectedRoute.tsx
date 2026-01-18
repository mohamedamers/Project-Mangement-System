import React from "react";
import { Navigate, useLocation } from "react-router-dom";
type Role = "Manager" | "Employee";

type ProtectedRouteProps = {
  children: React.ReactNode;
    allowedRoles?: Role[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children ,allowedRoles }) => {
 const location = useLocation();
  const token = localStorage.getItem("token");
    const role = (localStorage.getItem("userGroup") || "") as Role;

    if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/notfound" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;