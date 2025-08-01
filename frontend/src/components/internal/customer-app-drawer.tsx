import { Outlet } from "react-router-dom";
import TopNavbar, { customerNavMenu } from "./top-navbar";
import useFetch from "@/hooks/useFetch";
import { useUserSession } from "@/store/user-session.store";
import { Card, CardContent } from "../ui/card";

function CustomerAppDrawer() {
  const { login } = useUserSession();
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
  const labelHeader = customerNavMenu?.find(
    (item) => item.path === location.pathname
  );
  return (
    <div>
      <TopNavbar />
      <div className="p-3">
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

export default CustomerAppDrawer;
