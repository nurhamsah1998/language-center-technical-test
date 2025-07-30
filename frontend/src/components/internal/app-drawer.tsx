import { Navigate, Outlet } from "react-router-dom";

function AppDrawer() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || refreshToken) return <Navigate replace to="/login" />;
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AppDrawer;
