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

function TopNavbar() {
  return (
    <div className="bg-primary sticky top-0 text-white p-3 flex justify-between items-center">
      <div
        onClick={() => (window.location.href = "/")}
        className=" cursor-pointer"
      >
        E commerce
      </div>
      <div>
        {localStorage.getItem("accessToken") ? (
          <ProfileAvatar />
        ) : (
          <a className="cursor-pointer" href="/login">
            Login
          </a>
        )}
      </div>
    </div>
  );
}

const ProfileAvatar = memo(() => {
  const { name } = useUserSession();
  const nav = useNavigate();
  const handleLogOut = () => {
    const isOk = confirm("are you sure want to log out");
    if (isOk) {
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
      <DropdownMenuContent>
        <DropdownMenuLabel className=" max-w-[145px] text-ellipsis overflow-hidden text-nowrap">
          {name}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => nav("/profile")}
          className="cursor-pointer"
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => nav("/my-order")}
          className="cursor-pointer"
        >
          My order
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

export default TopNavbar;
