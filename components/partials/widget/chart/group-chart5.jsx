import React,{useEffect,useState,useRef} from "react";
import { colors } from "@/constant/data";
import dynamic from "next/dynamic";
import { walletService } from "@/services/wallet.services";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const columnCharthome2 = {
  series: [
    {
      name: "Revenue",
      data: [40, 70, 45, 100, 75, 40, 80, 90],
    },
  ],
  options: {
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
          return "$ " + val + "k";
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
    colors: colors.warning,
    grid: {
      show: false,
    },
  },
};
const columnCharthome3 = {
  series: [
    {
      name: "Revenue",
      data: [40, 70, 45, 100, 75, 40, 80, 90],
    },
  ],
  options: {
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
          return "$ " + val + "k";
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
    colors: colors.info,
    grid: {
      show: false,
    },
  },
};
const columnCharthome4 = {
  series: [
    {
      name: "Revenue",
      data: [40, 70, 45, 100, 75, 40, 80, 90],
    },
  ],
  options: {
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
          return "$ " + val + "k";
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
    colors: colors.success,
    grid: {
      show: false,
    },
  },
};

const GroupChart5 = () => {
  const [history, setHistory] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [spendings, setSpendings] = useState(null);
  const [spending_limit, setSpending_limit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await walletService.getWallet();

        if (response.status === 200) {
          const userData = response.data;
          // console.log(userData);
          setWallet(userData.balance);
        } else {
          _notifyError("Account not available");
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    fetchData();
  }, []);



  const wallet_balance = wallet;
  const acc_spending = spendings;
  const acc_limit = spending_limit;

  const naira = new Intl.NumberFormat('en-NG', {
    style : 'currency', 
    currency: 'NGN',
   maximumFractionDigits:0,
   minimumFractionDigits:0
  
  });
  const statistics = [
    {
      name: columnCharthome3,
      title: "Current balance ",
      count: wallet_balance,
      bg: "bg-[#E5F9FF] dark:bg-slate-900	",
      text: "text-info-500",
      icon: "heroicons:shopping-cart",
    },
    {
      name: columnCharthome4,
      title: "Spending",
      count: acc_spending,
      bg: "bg-[#E5F9FF] dark:bg-slate-900	",
      text: "text-warning-500",
      icon: "heroicons:cube",
    },
    {
      name: columnCharthome2,
      title: "Spending Limit",
      count: acc_limit,
      bg: "bg-[#E5F9FF] dark:bg-slate-900	",
      text: "text-[#5743BE]",
      icon: "heroicons:arrow-trending-up-solid",
    },
  ];

  
  return (
    <>
      {statistics.map((item, i) => (
        <div className="bg-slate-50 dark:bg-slate-900 rounded p-4" key={i}>
          <div className="text-slate-600 dark:text-slate-400 text-sm mb-1 font-medium">
            {item.title}
          </div>
          <div className="text-slate-900 dark:text-white text-lg font-medium">
            {item.count !== null ? naira.format(parseFloat(item.count)) : 'N/A'}
          </div>
          <div className="ml-auto max-w-[124px]">
            <Chart
              options={item.name.options}
              series={item.name.series}
              type="bar"
              height="48"
              width="124"
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default GroupChart5;
