import { useLocation, useNavigate } from "react-router-dom";
import { AlertDialogTrigger } from "../ui/alert-dialog";
import ModalAlert from "./modal-alert";

export const navMenu = [
  {
    title: "Dashboard",
    path: "/admin",
  },
  {
    title: "Product",
    path: "/admin/product",
  },
  {
    title: "Product category",
    path: "/admin/product-category",
  },
  {
    title: "Order",
    path: "/admin/order",
  },
];
function Sidebar() {
  const nav = useNavigate();
  const location = useLocation();
  const handleLogOut = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <>
      <div className=" w-[300px] p-3">
        <div className="bg-primary text-white py-2 px-4 rounded-sm">
          E Commerce
        </div>
        <div
          style={{
            height: "calc(100% - 60px)",
          }}
          className="mt-3 flex flex-col justify-between "
        >
          <div className="mt-3 flex flex-col gap-3">
            {navMenu.map((item) => (
              <div
                className={`cursor-pointer  py-2 px-4 rounded-sm text-sm duration-150 ${
                  location.pathname === item.path
                    ? "bg-slate-500 text-white"
                    : "text-slate-900 hover:bg-slate-200"
                }`}
                onClick={() => nav(item.path)}
                key={item.path}
              >
                {item.title}
              </div>
            ))}
          </div>
          <div>
            <ModalAlert
              handleSubmit={handleLogOut}
              labelSubmit="Log out"
              title="Confirm"
              desc="Are you sure want to log out ?"
            >
              <AlertDialogTrigger className=" cursor-pointer hover:bg-slate-200 text-left py-2 px-4 rounded-sm text-sm duration-150 w-full">
                log out
              </AlertDialogTrigger>
            </ModalAlert>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
