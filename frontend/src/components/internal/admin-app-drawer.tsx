import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar, { adminNavMenu } from "./sidebar";
import { Card, CardContent } from "../ui/card";
import useFetch from "@/hooks/useFetch";
import { useUserSession } from "@/store/user-session.store";
import AdminTopNavbar from "./admin-top-navbar";

function AdminAppDrawer() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const { login } = useUserSession();
  const location = useLocation();
  useFetch({
    api: "/profile",
    invalidateKey: "/profile",
    enabled: Boolean(localStorage.getItem("refreshToken")),
    onSuccess(res) {
      const profileData = res?.data;
      login({
        email: profileData.email,
        name: profileData?.profile.name,
        phoneNumber: profileData?.profile.phoneNumber,
        id: profileData.id,
        role: profileData?.role,
      });
    },
  });
  const labelHeader = adminNavMenu?.find(
    (item) => item.path === location.pathname
  );
  if (!accessToken || !refreshToken) return <Navigate replace to="/login" />;
  return (
    <div className="md:flex grid md:w-full md:h-dvh">
      <div className="md:flex hidden">
        <Sidebar />
      </div>
      <div className="md:hidden block">
        <AdminTopNavbar />
      </div>
      <div className="md:w-full p-3 overflow-hidden">
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
