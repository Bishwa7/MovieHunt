import { Navigate, Outlet } from "react-router-dom";

const AdminProtected = () => {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    return <Navigate to="/admin/auth" replace />;
  }


  return <Outlet />;
};

export default AdminProtected;
