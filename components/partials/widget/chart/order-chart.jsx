import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { colors } from "@/constant/data";
import React, { useEffect, useState } from "react";

const OrderChart = ({
  className = "bg-slate-50 dark:bg-slate-900 rounded pt-3 px-4",
  barColor = colors.warning,
}) => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      offsetX: 0,
      offsetY: 0,
      zoom: {
        enabled: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "60px",
        barHeight: "100%",
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "₦ " + val + "k";
        },
      },
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      show: false,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    colors: barColor,
    grid: {
      show: false,
    },
  };

  const [allOrders, setAllOrders] = useState([]);
  const [prevAllOrders, setPrevAllOrders] = useState(0);
  const [percentageChange, setPercentageChange] = useState(0);
  const [series, setSeries] = useState([
    {
      name: "Revenue",
      data: [40, 70, 45, 100, 75, 40, 80, 90],
    },
  ]);

  useEffect(() => {
    // Fetch historical order data for the chosen period.
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/Dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then((res) => {
      if (res.code === 200) {
        setAllOrders(res.all_orders);
      } else if (res.code === 401) {
        // Handle unauthorized user
      }
    });

    // You'll need to replace this with your actual data fetching logic.
    const historicalOrdersData = [40, 70, 45, 100, 75, 40, 80, 90];

    // Calculate the percentage change compared to the previous period.
    const currentOrders = allOrders; // Current orders count
    const previousOrders =
      historicalOrdersData[historicalOrdersData.length - 1]; // Orders count for the previous period

    // Calculate percentage change formula
    const changePercentage = ((currentOrders - previousOrders) / previousOrders) * 100;

    setPercentageChange(changePercentage);

    // Update the chart series with historical order data.
    setSeries([
      {
        name: "Revenue",
        data: historicalOrdersData,
      },
    ]);

    // Store the current orders count in local storage for future reference.
    localStorage.setItem("allOrders", currentOrders.toString());

    setAllOrders(currentOrders);
  }, [allOrders]);

  return (
    <div className={className}>
      <div className="text-sm text-slate-600 dark:text-slate-300 mb-[6px]">
        Orders
      </div>
      <div className="text-lg text-slate-900 dark:text-white font-medium mb-[6px]">
        {allOrders}
      </div>
      <div className="font-normal text-xs text-slate-600 dark:text-slate-300">
        <span className={`text-${percentageChange >= 0 ? "success" : "danger"}-500`}>
          {percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
        </span>{" "}
        From last Period
      </div>
      <div className="mt-4">
        <Chart type="bar" height="44" options={options} series={series} />
      </div>
    </div>
  );
};

export default OrderChart;
