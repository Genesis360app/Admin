import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import Cookies from "js-cookie"; // Import js-cookie


const EarningChart = ({
  className = "bg-slate-50 dark:bg-slate-900 rounded py-3 px-4 md:col-span-2",
}) => {
  const [isDark] = useDarkMode();
  

  const options = {
    labels: ["success", "Return"],
    dataLabels: {
      enabled: false,
    },
    colors: ["#0CE7FA", "#FA916B"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter",
      fontWeight: 400,
      markers: {
        width: 8,
        height: 8,
        offsetY: 0,
        offsetX: -5,
        radius: 12,
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  // Initialize the previous total order count from local storage
  const [prevTotalOrders, setPrevTotalOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTotalOrders = localStorage.getItem("totalOrders");
      return storedTotalOrders ? parseInt(storedTotalOrders, 10) : 0;

    }
    return 0;
  });
 

  const [totalOrders, setTotalOrders] = useState(prevTotalOrders);

  
useEffect(() => {
  var token = localStorage.getItem("token");

  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getOrders.php`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    // console.log(res);
    if (res.code === 200) {
      const newTotalOrders = res.total;
      setTotalOrders(newTotalOrders);

      // Calculate percentage change
      const percentageChange = ((newTotalOrders - prevTotalOrders) / prevTotalOrders) * 100;

      // Update previous total orders and store it in local storage
      setPrevTotalOrders(newTotalOrders);
      localStorage.setItem("totalOrders", newTotalOrders.toString());

      // Update percentageChange state
      setPercentageChange(percentageChange);
    } else if (res.code === 401) {
      setTimeout(() => {
        window.location.href = "/BusinessLogin";
      }, 2000);
    }
  });
}, [prevTotalOrders]);

// Declare percentageChange state
const [percentageChange, setPercentageChange] = useState(0);

const series = [totalOrders, prevTotalOrders];

  const naira = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  });

  return (
    <div className={` ${className}`}>
      <div className="flex items-center">
        <div className="flex-none">
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-[6px]">
            Earnings
          </div>
          <div className="text-lg text-slate-900 dark:text-white font-medium mb-[6px]">
            {naira.format(parseFloat(totalOrders))}
          </div>
          <div className="font-normal text-xs text-slate-600 dark:text-slate-300">
            <span className={`text-${percentageChange >= 0 ? "success" : "danger"}-500`}>
              {percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
            </span>{" "}
            From last Period
          </div>
        </div>
        <div className="flex-1">
          <div className="legend-ring2">
            <Chart
              type="donut"
              height="200"
              options={options}
              series={series}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningChart;
