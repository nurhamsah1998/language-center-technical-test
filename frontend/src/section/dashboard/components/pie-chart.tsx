import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function PieChart({
  analyticsProductCount,
}: {
  analyticsProductCount: { count: number; name: string }[];
}) {
  const [state, setState] = useState<{
    options: ApexOptions;
    series: number[];
  }>({
    series: [],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });
  useEffect(() => {
    setState({
      options: {
        ...state.options,
        labels: analyticsProductCount?.map((item) => item.name),
      },
      series: analyticsProductCount?.map((item) => item.count) || [],
    });
  }, [analyticsProductCount]);
  return (
    <div>
      <div className="text-md font-black text-slate-800">
        Product count by category
      </div>
      <div>
        <ReactApexChart
          options={state.options as ApexOptions}
          series={state.series}
          type="pie"
          width={380}
        />
      </div>
    </div>
  );
}

export default PieChart;
