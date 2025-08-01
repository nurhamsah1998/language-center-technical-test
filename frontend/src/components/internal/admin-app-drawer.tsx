import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar, { adminNavMenu } from "./sidebar";
import { Card, CardContent } from "../ui/card";

function AdminAppDrawer() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const location = useLocation();
  const labelHeader = adminNavMenu?.find(
    (item) => item.path === location.pathname
  );
  if (!accessToken || !refreshToken) return <Navigate replace to="/login" />;
  return (
    <div className="flex w-full h-dvh">
      <Sidebar />
      <div className="w-full p-3">
        <Card>
          <CardContent>
            <div className="text-xl font-bold text-slate-700 mb-3">
              {labelHeader?.title || "-"}
            </div>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAppDrawer;
