"use client";
import React, {useEffect, useState,useCallback} from "react";
import dynamic from "next/dynamic";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import GroupChart5 from "@/components/partials/widget/chart/group-chart5";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import HistoryChart from "@/components/partials/widget/chart/history-chart";
import AccountReceivable from "@/components/partials/widget/chart/account-receivable";
import AccountPayable from "@/components/partials/widget/chart/account-payable";
import ExampleTwo from "@/components/partials/table/AllTransactions";

const CardSlider = dynamic(
  () => import("@/components/partials/widget/CardSlider"),
  {
    ssr: false,
  }
);
import TransactionsTable from "@/components/partials/table/transactions";
import SelectMonth from "@/components/partials/SelectMonth";
import HomeBredCurbs from "@/components/partials/HomeBredCurbs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const users = [
  {
    name: "Ab",
  },
  {
    name: "Bc",
  },
  {
    name: "Cd",
  },
  {
    name: "Df",
  },
  {
    name: "Ab",
  },
  {
    name: "Sd",
  },
  {
    name: "Sg",
  },
];

const BankingPage = () => {
  const date = new Date();
  const hour = date.getHours();
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [wallet, setWallet] = useState(null);
  const [userId, setUserId] = useState('');
  const [recieverName, setRecieverName] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState("");
const [lastname, setLastname] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showWithdrawButton, setShowWithdrawButton] = useState(true);

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setRecieverName(''); // Reset the userName when userId changes
    setMessage(''); // Reset the message when userId changes
  };

  const fetchUserName = async () => {
    setIsLoading(true);
     var userid = localStorage.getItem("userid");
     var token = localStorage.getItem("token");
     var data = new FormData();
     data.append("userId", userId);
     data.append("recieverName", recieverName);
     data.append("amount", amount);
     try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/wallets/confirm/${userid}/${recieverName}`, {
         headers: {
             "Authorization": `Bearer ${token}`
         },
         method: "GET",

         })
         
       const data = await response.json();
       console.log(data);
       if (data.code == 200) {
           setShowWithdrawButton(false);
         setFirstname(data.payload.first_name);
         setLastname(data.payload.last_name);
         setEmail(data.payload.email);
       } else {
         setRecieverName('User not found.');
       }
     } catch (error) {
        
           
     } finally {
       setIsLoading(false);
     }
   };
   const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setRecieverName(e.target.value);
  };

  useEffect(() => {
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((res) => {
        // console.log(res);
        if (res.code === 200) {
          setWallet(res.user.wallet);
          setUserId(res.user.user_id);
          setFirstname(res.user.first_name);
          setLoggedIn(true);
        } else if (res.code === 401) {
          toast.error(res.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          setTimeout(() => {
            router.push("/");
          }, 1500);
          // Handle unauthorized error...
        }
      });
  }, []);


  const sendMoney = async () => {

    if (wallet !== null) {
      if (wallet <= 0) {
        toast.error("Your balance is low", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // Wallet balance is sufficient, proceed with sending money
        // The sendMoney function code you provided here
        // ...
       
        toast.warning(`Wallet balance is sufficient ₦ ${wallet}`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } else {
      // Handle the case when wallet is null
    
     
    }
    
    setIsLoading(true);
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    var data = new FormData();
  
    if (userid && token) {
      data.append("userid", userid);
      data.append("receiver", recieverName);
      data.append("amount", amount);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/wallets/send`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: data,
        });
  
        const responseData = await response.json();
  
        if (responseData.code === 200) {
          setMessage(responseData.message);
          
        } else {
          // setMessage('Failed to send money.');
          
          toast.error(`Failed to send money.`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (error) {
        // setMessage('Error occurred while sending money.');
       
        toast.error(`Error occurred while sending money.`, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // setMessage('User ID or token is missing.');
      
      toast.info(`User ID or token is missing.`, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  const naira = new Intl.NumberFormat('en-NG', {
    style : 'currency', 
    currency: 'NGN',
   maximumFractionDigits:0,
   minimumFractionDigits:0
  
  });

  return (
    <div className="space-y-5">
    <ToastContainer/>
      <HomeBredCurbs title="Banking" />
      <Card>
        <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5 place-content-center">
          <div className="flex space-x-4 h-full items-center rtl:space-x-reverse">
            <div className="flex-none">
              <div className="h-20 w-20 rounded-full">
                <img
                  src="/assets/images/all-img/main-user.png"
                  alt=""
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-medium mb-2">
              {hour >= 12
    ? hour >= 16
      ? <span className="block font-normal">Good evening,</span>
      : <span className="block font-normal">Good Afternoon</span>
    :  <span className="block font-normal">Good Morning</span>
    }
                <span className="block">{firstname}</span>
              </h4>
              <p className="text-sm dark:text-slate-300">Welcome to Genesis360</p>
            </div>
          </div>
          <GroupChart5 />
        </div>
      </Card>
      <div className="grid grid-cols-12 gap-5">
      {/* <form> */}
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <Card title="My card"> 
            <div className="max-w-[90%] mx-auto mt-2">
              <CardSlider />
            </div>
          </Card>
          <Card title="Quick transfer">
            <div className="space-y-6">
           
              <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4">
                <div className="flex justify-between mb-2">
                  <span className="text-lg text-slate-900 dark:text-white">
                    Contacts
                  </span>
                  {/* <Link
                    href="#"
                    className="font-medium text-slate-900 dark:text-white underline text-sm"
                  >
                    View all
                  </Link> */}
                </div>
                <SimpleBar>
                  <ul className="flex space-x-6 py-3 px-1">
                    {users.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={` h-[42px] w-[42px] cursor-pointer text-xl font-medium capitalize flex-none rounded-full bg-primary-500 text-white flex flex-col items-center justify-center
                     ${
                       activeIndex === i
                         ? "ring-2 ring-primary-500 ring-offset-2 "
                         : ""
                     }
                      `}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </SimpleBar>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <span
                  className="text-xs text-slate-500 dark:text-slate-400 block mb-1 cursor-pointer font-normal"
                  htmlFor="cdp"
                >
                  Amount
                </span>
                <Textinput
                 value={amount}
                 placeholder="Amount"
                onChange={handleAmountChange}
                  id="cdp"
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 placeholder:font-medium  h-auto font-medium"
                />
              </div>
              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <label
                  className="text-xs text-slate-500 dark:text-slate-400 block cursor-pointer mb-1"
                  htmlFor="cd"
                >
                  Recipient username
                </label>

                <Textinput
                  placeholder="Enter Reciever's username"
                  isMask
                  id="cd"
                  value={recieverName}
                  onChange={handleUsernameChange}
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 h-auto placeholder:font-medium font-medium"
                />
              </div>

              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <label
                  className="text-xs text-slate-500 dark:text-slate-400 block cursor-pointer mb-1"
                  htmlFor="id"
                >
                  {/* Recipient username */}
                </label>

                <input
                  id="userid"
                  value={userId}
                  onChange={handleUserIdChange}
                  placeholder="Enter user ID"
                  hidden
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 h-auto placeholder:font-medium font-medium"
                />
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    Total amount
                  </span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white block">
                  {wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}
                  </span>
                </div>
                <div>
                {showWithdrawButton ? (
                  <button type="button" className="btn btn-dark" 
                  onClick={fetchUserName}
                  // onClick={() => console.log("datannn")}
                  disabled={!userId || !recieverName || !amount || isLoading}>
                   {isLoading ? 'Please wait...' : 'Send money'}
                  </button>
                  ) : (
                    <>
                  <br />

                  {firstname ? (
               <>
              <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
                <input
                 type="text"
                  id="account_name"
                  name="account_name"
                  value={firstname + "" + lastname} 
                  disabled
                  className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 h-auto placeholder:font-medium font-medium"
                />
              </div>
             
</>
 ) : (
  <center>
        <b> <p>Account not found</p></b> 
          <button
             className="btn btn-dark" 
            onClick={fetchUserName}
            disabled={!userId || !recieverName || !amount || isLoading}
          >
            {isLoading ? 'Please wait...' : 'Confirm again'}
          </button>
        </center>
      )}
      {firstname && (
       
        <button type="button" className="btn btn-dark bg-gradient-to-r from-[#00b09b] from-10% via-sky-500 via-30% to-[#96c93d] to-90%" 
  
          onClick={sendMoney}
          disabled={!userId || !recieverName || !amount || isLoading}
        >
          {isLoading ? 'Sending...' : 'Transfer Fund'}
        </button>
      )}
    </>
  )}
                </div>
              </div>
            </div>
          
          </Card>
        </div>
{/* 
        </form> */}

        <div className="lg:col-span-8 col-span-12">
          <div className="space-y-5 bank-table">
            <TransactionsTable />
            <Card title="History" headerslot={<SelectMonth />}>
              <div className="legend-ring4">
                <HistoryChart />
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
        <Card title="Account Receivable" headerslot={<SelectMonth />}>
          <AccountReceivable />
        </Card>
        <Card title="Account Payable" headerslot={<SelectMonth />}>
          <AccountPayable />
        </Card>
      </div>
        <ExampleTwo title="All Transaction" />
    </div>
  );
};

export default BankingPage;
