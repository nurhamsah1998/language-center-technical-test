import type { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

function AreaChart({
  analyticsRevenue,
}: {
  analyticsRevenue: { date_gs: string; revenue: number }[];
}) {
  const [state, setState] = useState<{
    options: ApexOptions;
    series: { name: string; data: number[] }[];
  }>({
    series: [],
    options: {
      chart: {
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        type: "category",
        categories: [],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
    },
  });
  useEffect(() => {
    setState({
      options: {
        ...state.options,
        xaxis: {
          type: "category",
          categories: analyticsRevenue?.map((item) =>
            new Date(item?.date_gs).toDateString()
          ),
        },
      },
      series: [
        {
          name: "Revenue",
          data: analyticsRevenue?.map((item) => item?.revenue) || [],
        },
      ],
    });
  }, [analyticsRevenue]);
  return (
    <div>
      <div className="text-md font-black text-slate-800">Revenue</div>
      <div>
        <ReactApexChart
          options={state.options as ApexOptions}
          series={state.series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
}

export default AreaChart;
