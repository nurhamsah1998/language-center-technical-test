import useFetch from "@/hooks/useFetch";
import AreaChart from "./components/area-chart";

function DashboardSection() {
  const { data } = useFetch({
    api: `/analytics/revenue`,
    invalidateKey: `/analytics/revenue`,
  });
  const analyticsRevenue = data?.data;
  console.log(analyticsRevenue, "<---");
  return (
    <div>
      <div className=" relative">
        <AreaChart />
      </div>
    </div>
  );
}

export default DashboardSection;
