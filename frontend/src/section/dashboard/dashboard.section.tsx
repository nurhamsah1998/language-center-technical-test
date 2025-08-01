import { useUserSession } from "@/store/user-session.store";

function DashboardSection() {
  const { email } = useUserSession();
  console.log(email);
  return <div>DashboardSection</div>;
}

export default DashboardSection;
