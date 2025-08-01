import { Outlet } from "react-router-dom";
import TopNavbar from "./top-navbar";
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
      });
    },
  });
  return (
    <div>
      <TopNavbar />
      <div className="p-3">
        <Card>
          <CardContent>
            <Outlet />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CustomerAppDrawer;
