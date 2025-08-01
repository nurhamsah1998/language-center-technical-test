import { useUserSession } from "@/store/user-session.store";

function TopNavbar() {
  const { id: userId, name } = useUserSession();
  return (
    <div className="bg-primary text-white p-3 flex justify-between items-center">
      <div>E commerce</div>
      <div>
        {userId ? (
          <p className="text-right text-ellipsis relative w-[200px] overflow-hidden text-nowrap">{`Hello, ${name}`}</p>
        ) : (
          <a className="cursor-pointer" href="/login">
            Login
          </a>
        )}
      </div>
    </div>
  );
}

export default TopNavbar;
