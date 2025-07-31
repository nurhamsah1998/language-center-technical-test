import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { Card, CardContent } from "../ui/card";

function AppDrawer() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (!accessToken || !refreshToken) return <Navigate replace to="/login" />;
  return (
    <div className="flex w-full h-dvh">
      <Sidebar />
      <div className="w-full p-3">
        <Card>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AppDrawer;
