import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const localUser = localStorage.getItem("marentUser");
  if (localUser !== null) {
    const user = JSON.parse(localUser);

    if (!user?.userId) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default AdminRoute;
