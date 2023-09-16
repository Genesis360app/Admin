import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";

const ProfitChart = ({
  className = "bg-slate-50 dark:bg-slate-900 rounded pt-3 px-4",
  color = "#4669FA",
}) => {
  const [isDark] = useDarkMode();
  const series = [
    {
      data: [15, 30, 15, 30, 20, 35],
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      offsetX: 0,
      offsetY: 0,

      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: [2],
      curve: "straight",
      dashArray: [0, 8, 5],
    },
    dataLabels: {
      enabled: false,
    },

    markers: {
      size: 4,
      colors: color,
      strokeColors: color,
      strokeWidth: 2,
      shape: "circle",
      radius: 2,
      hover: {
        sizeOffset: 1,
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
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#e2e8f0",
      strokeDashArray: 5,
      position: "back",
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    colors: [color],
  };

  const [allUsers, setAllUsers] = useState([]);
  const [prevAllUsers, setPrevAllUsers] = useState(0);

  useEffect(() => {
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/Dashboard`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then((res) => {
      if (res.code === 200) {
        const newAllUsers = res.all_users;
        setAllUsers(newAllUsers);

        // Calculate percentage change
        const percentageChange = ((newAllUsers - prevAllUsers) / prevAllUsers) * 100;

        // Update previous all users and store it in local storage
        setPrevAllUsers(newAllUsers);
        localStorage.setItem("allUsers", newAllUsers.toString());

        // Update percentageChange state
        setPercentageChange(percentageChange);
      } else if (res.code === 401) {
        // Handle unauthorized user
      }
    });
  }, [prevAllUsers]);

  // Declare percentageChange state
  const [percentageChange, setPercentageChange] = useState(0);

  return (
    <div className={className}>
      <div className="text-sm text-slate-600 dark:text-slate-300 mb-[6px]">
        Customers
      </div>
      <div className="text-lg text-slate-900 dark:text-white font-medium mb-[6px]">
        {allUsers}
      </div>
      <div className="font-normal text-xs text-slate-600 dark:text-slate-300">
        <span className="text-primary-500">+{percentageChange.toFixed(2)}% </span>
        From last Period
      </div>
      <div className="mt-4">
        <Chart type="line" height="44" options={options} series={series} />
      </div>
    </div>
  );
};

export default ProfitChart;
