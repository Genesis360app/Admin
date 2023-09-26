import React,{useEffect,useState,useRef} from "react";
import Icon from "@/components/ui/Icon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@/components/ui/Tooltip";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { colors } from "@/constant/data";
import dynamic from "next/dynamic";
// import Select from "@/components/ui/Select";
import Select from 'react-select';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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

const ProductBredCurbs = ({ title }) => {
  const [activeModal, setActiveModal] = useState(false);
  const [paybusinessModal, setPaybusinessModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });

  const [account_number, setAccount_number] = useState("");
  const [account_name, setAccount_name] = useState("");
  const [amount, setAmount] = useState("");
  
  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showWithdrawButton, setShowWithdrawButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [user_id, setUser_id] = useState('');
  const [userId, setUserId] = useState('');
  const [recieveremail, setRecieveremail] = useState('');
  const [email, setEmail] = useState('');
  const [sendamount, setSendamount] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const naira = new Intl.NumberFormat('en-NG', {
    style : 'currency', 
    currency: 'NGN',
   maximumFractionDigits:0,
   minimumFractionDigits:0
  
  });
  const wallet_balance = wallet;

  useEffect(() => {
    var token = localStorage.getItem("token");
    var userid = localStorage.getItem("userid");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
      headers: {
          "Authorization": `Bearer ${token}`
      }
      })
      .then(response => response.json())
      .then((res) => {
      // console.log(res);
      if(res.code == 200){
         
          setWallet(res.user.wallet);
          setUser_id(res.user.user_id);
          setEmail(res.user.email);
        }
      });
  }, []);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userid = localStorage.getItem("userid");

    // Fetch banks
    fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/wallets/listBanks`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then((res) => {
      const banks = res.map((bank) => ({
        value: bank.code,
        label: bank.name,
        slug: bank.slug
      }));
      setBankOptions(banks);
    });
  }, []);

  const handleWithdraw = async () => {
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const userid = localStorage.getItem("userid");
      const data = new FormData();
      data.append("userid", user_id);
      data.append("account_number", account_number);
      data.append("amount", amount);
      
      if (selectedBank) {
        data.append("bank_code", selectedBank.value);
      } else {
        // Handle the case where selectedBank is null
        // For example, you could show an error message to the user
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/wallets/withdraw`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: data
      });
  
      const res = await response.json();
  
      setIsLoading(false);
  
      if (res.code === 200) {
        // Show success message
        toast.success(res.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else if (res.code === 401) {
        // Handle unauthorized error...
      } else {
        // Handle other error cases...
      }
    } catch (error) {
      
      setIsLoading(false);
      // Handle error cases...
      toast.error(`An error occurred: ${error}`, {
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
  };

  const handleValidateAccount = async () => {
    setIsLoading(true);
    const userid = localStorage.getItem("userid");
    const token = localStorage.getItem("token");
    var formData = new FormData();
    formData.append("client", "payloadx");
    formData.append("api_key", "123456"); // Make sure to use a string instead of a number
  
    try {
      if (selectedBank) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VALIDATE_URL}/account/${account_number}/${selectedBank.value}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          method: "GET"
        });
  
        const responseData = await response.json();
        // console.log(responseData)
        if (responseData.code === 200) {
          setAccount_name(responseData.account_info.account_name);
          setAccount_number(responseData.account_info.account_number);
          setShowWithdrawButton(false); // Hide the "Fetch Username" button
        } else {
          setAccount_name('');
          setAccount_number('');
          setShowWithdrawButton(true); // Show the "Fetch Username" button again
        }
      } else {
        
        toast.warning(`No bank selected.`, {
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
      
      toast.info(`Check your bank info:${error}`, {
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
  };

  const handleValueChange = (newValue) => {
    setValue(newValue);
  };



 
  const send_bizMoney = async () => {

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
    
    setIsLoading1(true);
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    var data = new FormData();
  
    if (userid && token) {
      data.append("sender_email", senderemail);
      data.append("receiver_email", recieveremail);
      data.append("amount", sendamount);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Wallet/sendMoney`, {
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
        setIsLoading1(false);
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
      setIsLoading1(false);
    }
  };

  const handleUseremailChange = (e) => {
    setEmail(e.target.value);
  
  };

  const handleSendAmountChange = (e) => {
    setSendamount(e.target.value);
  };

  const handlerecieverChange = (e) => {
    setRecieveremail(e.target.value);
  };

  const statistics = [
    {
      name: columnCharthome3,
      title: "Current balance ",
      count: wallet_balance,
      bg: "bg-[#E5F9FF] dark:bg-slate-900	",
      text: "text-info-500",
      icon: "heroicons:shopping-cart",
    },
    
  ];


  
  

  return (

    <div className="flex flex-wrap items-center justify-between mb-6 ">
    <Modal
           activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title="Withdraw Fund"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setActiveModal(false)}
          />
            }
          >
        
    <div className="bg-white mt-5 flex items-center gap-2  justify-center py-3 shadow-[0px_0px_5px_0px_#0000004D]">
               {statistics.map((item, i) => (
               <div>
               <>
               <p className="text-base font-medium text-green">Wallet Balance</p>
              {Number(wallet) === 0 ? (
                <p className="text-[50px] font-bold leading-[88px] text-[#FF1818]">{wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}</p>
                ) : (
                  <p className="text-[50px] font-bold leading-[88px] text-[#1FCC6C]">{wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}</p>
              )}
         </>
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
          </div>
          <br/>
            <div className="text-base text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <span
                  className="block mb-1 text-xs font-normal cursor-pointer text-slate-500 dark:text-slate-400"
                  htmlFor="Account_Number"
                >
                  Account Number
                </span>
                <Textinput
                //  value={amount}
                 placeholder="Account Number"
                 onChange={(e) => {
                    setAccount_number(e.target.value);
                  }}
                  value={account_number}
                  id="Account_Number"
                  min="1000000000" // Minimum value (10 digits)
                max="9999999999" // Maximum value (10 digits)
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>
          <br/>
            <div className="text-base text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <span
                  className="block mb-1 text-xs font-normal cursor-pointer text-slate-500 dark:text-slate-400"
                  htmlFor="Amount"
                >
                  Amount
                </span>
                <Textinput
                 placeholder="Amount"
                 onChange={(e) => {
                        setAmount(e.target.value);
                      }}
                 value={amount}
                  id="Amount"
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
            </div>
          <br/>
            <div className="text-base text-slate-600 dark:text-slate-300">
            <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
  <span
    className="block mb-1 text-xs font-normal cursor-pointer text-slate-500 dark:text-slate-400"
    htmlFor="Select_Bank"
  >
    Select Bank
  </span>
  <Select
    id="bank"
    name="bank"
    onChange={(selectedOption) => {
      setSelectedBank(selectedOption);
    }}
    value={selectedBank}
    options={bankOptions}
    className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
    styles={{
      // Add custom styles for the Select component here
      // You can override the default styles of the Select component
    }}
  />
</div>
<br/>

              {showWithdrawButton ? (
                  <Button type="button" className="w-full ml-auto btn btn-dark" 
                  onClick={handleValidateAccount}
                  // onClick={() => console.log("datannn")}
                  disabled={!selectedBank || !account_number || !amount || isLoading}>
                   {isLoading ? 'Please wait...' : 'Confirm'}
                  </Button>
                  ) : (
                    <>
                  <br />

                  {account_name ? (
               <>
              <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <Textinput
                
                  type="text"
                  id="account_name"
                  name="account_name"
                  value={account_name} 
                  disabled
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
             
</>
 ) : (
  <center>
        <b> <p>Account not found</p></b> 
          <Button
             className="btn btn-dark" 
            onClick={handleValidateAccount}
            disabled={!selectedBank || !account_number || !amount || isLoading}
          >
            {isLoading ? 'Please wait...' : 'Confirm again'}
          </Button>
        </center>
      )}
      {account_name && (
        <Button
        className="bg-gradient-to-r from-[#00b09b] from-10% via-sky-500 via-30% to-[#96c93d] to-90% .. w-full text-white p-4 font-bold text-xl mt-4"
          onClick={handleWithdraw}
          disabled={!selectedBank || !account_number || !amount || isLoading}
        >
          {isLoading ? 'Processing ...' : 'Withdraw'}
        </Button>
      )}
    </>
  )}
   </div>
       </Modal>


       {/* pay business modal */}
       
    <Modal
            title="Pay Businesses In Credit"
            label="Pay Businesses  "
            labelClass="btn-outline-dark"
            themeClass="bg-slate-600 text-slate-900"
            activeModal={paybusinessModal}
            onClose={() => setPaybusinessModal(false)}
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setActiveModal(false)}
          />
            }
          >
           
           <div className="bg-white mt-5 flex items-center gap-2  justify-center py-3 shadow-[0px_0px_5px_0px_#0000004D]">
               {statistics.map((item, i) => (
               <div>
               <>
               <p className="text-base font-medium text-green">Wallet Balance</p>
              {Number(wallet) === 0 ? (
                <p className="text-[50px] font-bold leading-[88px] text-[#FF1818]">{wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}</p>
                ) : (
                  <p className="text-[50px] font-bold leading-[88px] text-[#1FCC6C]">{wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}</p>
              )}
         </>
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
          </div>
          <br/>

          <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <span
                  className="block mb-1 text-xs font-normal cursor-pointer text-slate-500 dark:text-slate-400"
                  htmlFor="cdp"
                >
                  Amount
                </span>
                <Textinput
                 placeholder="Amount"
                onChange={handleSendAmountChange}
                  id="cdp"
                 value={sendamount}
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
              <br/>
              <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <label
                  className="block mb-1 text-xs cursor-pointer text-slate-500 dark:text-slate-400"
                  htmlFor="cd"
                >
                  Recipient username
                </label>

                <Textinput
                  placeholder="Enter Reciever's email"
                  isMask
                  // type="email"
                  id="email"
                  onChange={handlerecieverChange}
                  value={recieveremail}
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
              <br/>
              <div className="p-4 rounded-md bg-slate-100 dark:bg-slate-900">
                <label
                  className="block mb-1 text-xs cursor-pointer text-slate-500 dark:text-slate-400"
                  htmlFor="sender_email"
                >
                  {/*  sender_email */}
                </label>

                <input
                  id="sender_email"
                  type="email"
                  onChange={handleUseremailChange}
                  // placeholder="Enter user ID"
                  disabled
                  value={email}
                  className="h-auto p-0 text-sm font-medium bg-transparent border-none focus:ring-0 focus:border-none text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                />
              </div>
              <br/>
              <div className="flex justify-between">
                <div>
                  <span className="block mb-1 text-xs text-slate-500 dark:text-slate-400">
                    Total amount
                  </span>
                  <span className="block text-lg font-medium text-slate-900 dark:text-white">
                  {wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}
                  </span>
                </div>
                <br/>
                <div>
                {showWithdrawButton ? (
                 
                  <button
             className="btn btn-dark" 
            onClick={send_bizMoney}
            disabled={!recieveremail || !email || !sendamount || isLoading1}
          >
            {isLoading1 ? 'Please wait...' : 'Send'}
          </button>

                 
 ) : (

     ""
  )}

  </div>
  </div>

          </Modal>

      <h4 className="inline-block text-xl font-medium capitalize lg:text-2xl text-slate-900 ltr:pr-4 rtl:pl-4">
        {title}
      </h4>
      <div className="flex items-center space-x-2 sm:space-x-4 sm:justify-end rtl:space-x-reverse">
        <div className="inline-flex space-x-2 text-sm font-normal bg-white cursor-pointer date-btn btn btn-md whitespace-nowrap rtl:space-x-reverse dark:bg-slate-800 dark:text-slate-300 h-min text-slate-900" onClick={() => setActiveModal(true)}>
          <span className="text-lg">
            <Icon icon="tdesign:money" />
          </span>
          <span>Withdraw Fund</span>
        </div>
        <div className="inline-flex space-x-2 text-sm font-normal bg-white cursor-pointer date-btn btn btn-md whitespace-nowrap rtl:space-x-reverse dark:bg-slate-800 dark:text-slate-300 h-min text-slate-900" onClick={() => setPaybusinessModal(true)}>
          <span className="text-lg">
            <Icon icon="dashicons:money" />
          </span>
          <span>Pay Business</span>
        </div>
      </div>
    </div>
  );
};

export default ProductBredCurbs;
