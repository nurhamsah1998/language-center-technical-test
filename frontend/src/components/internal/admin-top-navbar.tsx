import { ProfileAvatar } from "./customer-top-navbar";
import { adminNavMenu } from "./sidebar";

function AdminTopNavbar() {
  return (
    <div className="bg-primary z-[999] sticky top-0 text-white p-3 flex justify-between items-center">
      <div
        onClick={() => (window.location.href = "/")}
        className=" cursor-pointer"
      >
        E commerce
      </div>
      <div>
        {localStorage.getItem("accessToken") ? (
          <ProfileAvatar navMenu={adminNavMenu} />
        ) : (
          <a className="cursor-pointer" href="/login">
            Login
          </a>
        )}
      </div>
    </div>
  );
}

export default AdminTopNavbar;
