import useFetch from "@/hooks/useFetch";
import AreaChart from "./components/area-chart";
import PieChart from "./components/pie-chart";

function DashboardSection() {
  const { data: revenue } = useFetch({
    api: `/analytics/revenue`,
    invalidateKey: `/analytics/revenue`,
  });
  const { data: productCount } = useFetch({
    api: `/analytics/product-count`,
    invalidateKey: `/analytics/product-count`,
  });
  return (
    <div>
      <div>
        <AreaChart analyticsRevenue={revenue?.data} />
        <PieChart analyticsProductCount={productCount?.data} />
      </div>
    </div>
  );
}

export default DashboardSection;
