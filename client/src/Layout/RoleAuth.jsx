import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../services/useAuth";

const RoleAuth = ({ allowedRoles }) => {
  const auth = useAuth();
  const location = useLocation();

  return allowedRoles?.find(
    (role) => role === JSON?.parse(auth?.user)?.role
  ) ? (
    <Outlet />
  ) : auth?.user?.name ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/landing" state={{ from: location }} replace />
  );
};

export default RoleAuth;
