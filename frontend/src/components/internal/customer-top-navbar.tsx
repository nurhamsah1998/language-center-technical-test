import { useUserSession } from "@/store/user-session.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { memo } from "react";
import { useNavigate } from "react-router-dom";

export const customerNavMenu = [
  {
    title: "Profile",
    path: "/profile",
  },
  {
    title: "My order",
    path: "/my-order",
  },
];

function CustomerTopNavbar() {
  return (
    <div className="bg-primary z-[99] sticky top-0 text-white p-3 flex justify-between items-center">
      <div
        onClick={() => (window.location.href = "/")}
        className=" cursor-pointer"
      >
        E commerce
      </div>
      <div>
        {localStorage.getItem("accessToken") ? (
          <ProfileAvatar navMenu={customerNavMenu} />
        ) : (
          <a className="cursor-pointer" href="/login">
            Login
          </a>
        )}
      </div>
    </div>
  );
}

export const ProfileAvatar = memo(
  ({ navMenu }: { navMenu: { title: string; path: string }[] }) => {
    const { name, logout } = useUserSession();
    const nav = useNavigate();
    const handleLogOut = () => {
      const isOk = confirm("are you sure want to log out");
      if (isOk) {
        logout();
        localStorage.clear();
        window.location.href = "/";
      }
    };
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className=" cursor-pointer">
          <Avatar>
            <AvatarFallback className=" capitalize text-slate-800">
              {name?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" z-[100]">
          <DropdownMenuLabel className=" max-w-[145px] text-ellipsis overflow-hidden text-nowrap">
            {name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {navMenu.map((item) => (
            <DropdownMenuItem
              key={item.path}
              onClick={() => nav(`${item.path}`)}
              className="cursor-pointer"
            >
              {item.title}
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

export default CustomerTopNavbar;
