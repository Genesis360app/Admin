import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import { userService } from "@/services/users.service";

const ProfitChart = ({
  className = "px-4 pt-3 rounded bg-slate-50 dark:bg-slate-900",
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
  const [newAllUsers, setNewAllUsers] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userService.totalCustomer();
  
        if (response && response.userCount) {
          // console.log("user",response);
          setAllUsers(response.userCount);
        } else {
          // Handle case where response or response.No_Of_Registered_Users is undefined
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    if (prevAllUsers !== null && newAllUsers !== null) {
      const percentageChange = ((newAllUsers - prevAllUsers) / prevAllUsers) * 100;
      setPercentageChange(percentageChange);
      localStorage.setItem("allUsers", newAllUsers.toString());
    }
  }, [prevAllUsers, newAllUsers]);
  

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
      <div className="text-xs font-normal text-slate-600 dark:text-slate-300">
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
