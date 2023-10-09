'use client'

import React,{useEffect,useState,useMemo} from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import GlobalFilter from "./GlobalFilter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useRouter } from 'next/navigation'
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import axios from 'axios'; // Import Axios at the top of your file



const AllSubcriptions = ({ title = ("User Subscriptions"), item }) => {
  const dispatch = useDispatch();
  const router = useRouter()

  const [subByID, setSubByID] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user_id, setUser_id] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [businessIsPartner, setBusinessIsPartner] = useState("");
  const [income, setIncome] = useState("");
  const [spending_limit, setSpending_limit] = useState("");
  const [outstanding, setOutstanding] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isBusiness, setIsbusiness] = useState(null);
  const [status, setStatus] = useState(null);
  
// Function to format date value
function formattedDate(rawDate) {
  const date = new Date(rawDate);

  if (!isNaN(date.getTime())) {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true, // Use 24-hour format
    };

    const formattedDate = date.toLocaleString(undefined, options);
    return <span>{formattedDate}</span>;
  } else {
    return <span>Invalid Date</span>;
  }
}

const last25Items = subByID;

// Sort the last 25 items by the 'id' property in ascending order
last25Items.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return  idB  - idA; // Sort in ascending order by 'id'
});

// Function to filter data based on globalFilter value
// Function to filter data based on globalFilter value
const filteredData = useMemo(() => {
return (last25Items || []).filter((item) => {
  const sub_id = (item.sub_info?.id|| "").toString(); // Access product_name safely and convert to lowercase
  const status_text = (item.sub_info?.status_text || "").toString(); // Access package_id safely and convert to string
  const package_name = (item.package?.package_name|| "").toString(); // Access package_id safely and convert to string

  // Check if globalFilter is defined and not null before using trim
  const filterText = globalFilter ? globalFilter.trim() : "";

  // Customize this logic to filter based on your specific requirements
  return (
    sub_id.includes(filterText.toLowerCase()) ||
    status_text.includes(filterText)||
    package_name.includes(filterText)
  );
});
}, [subByID, globalFilter]);


const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const handleNextPage = () => {
  if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
    setCurrentPage((prevPage) => prevPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prevPage) => prevPage - 1);
  }
};

// Calculate the index range for the current page
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

// Get the paginated history data for the current page
const paginatedHistory = filteredData.slice(startIndex, endIndex);

// Calculate the total number of pages
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const getPageNumbers = () => {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const middlePage = Math.ceil(maxPageButtons / 2);

  let startPage = currentPage - middlePage + 1;
  let endPage = currentPage + middlePage - 1;

  if (totalPages <= maxPageButtons) {
    startPage = 1;
    endPage = totalPages;
  } else if (currentPage <= middlePage) {
    startPage = 1;
    endPage = maxPageButtons;
  } else if (currentPage >= totalPages - middlePage) {
    startPage = totalPages - maxPageButtons + 1;
    endPage = totalPages;
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return pageNumbers;
};

useEffect(() => {
  const fetchData = async () => {
    try {
      var token = localStorage.getItem("token");
      var userid = localStorage.getItem("userid");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getSubscription.php?userid=24011343-7323075-4480759`, {
        cache: 'no-store',
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Handle error if the response is not OK
        toast.warning("Network response was not ok", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const res = await response.json();

      // console.log(res);

      if (res.code === 200) {
        setSubByID(res.sub);
        setUser_id((res.sub[1].sub_info.userid));
      } else if (res.code === 401) {
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
   
      // Handle errors here
      toast.error(error, {
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

  var token = localStorage.getItem("token");
  // Use the orderId prop directly
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getKYC.php?userid=${user_id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    
    // console.log(res);
    if (res.code === 200) {
      setStatus(res.kyc.status);
    } else if (res.code === 401) {
    
    }
  });


  const fetchDatas = async () => {
    try {
      const token = localStorage.getItem('token');
      const userid = localStorage.getItem('userid');

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/User/riskAnalysis?userid=20285485-1986772-930711696&from=11-01-2022&to=01-01-2023`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        // Handle error if the response data is not available
        toast.warning('Network response was not ok', {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(response.data);

      if (response.data.code === 200) {
        // Handle successful response
      } else if (response.data.code === 401) {
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (error) {
      // Handle errors here
      toast.error(error.message, {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };



  var token = localStorage.getItem("token");
axios({
  method: 'get',
  url: `${process.env.NEXT_PUBLIC_BASE_URL}/User/getKYC.php?userid=${user_id}`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    // const res = response.data; // Access the response data

    if (res.code === 200) {
      setStatus(res.kyc.status);
    } else if (res.code === 401) {
      // Handle unauthorized error if needed
    }
  })
  .catch((error) => {
    // Handle errors here, such as network errors or invalid responses
    console.error('Error:', error);
  });
  

  var token = localStorage.getItem("token");
  // Use the orderId prop directly
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${user_id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    
    // console.log(res);
    if (res.code === 200) {
          setFirstname(res.user.first_name);
          setEmail(res.user.email);
          setUsername(res.user.username);
          setLastname(res.user.last_name);
          setPhone(res.user.phone);
          setIsbusiness(res.user.isBusiness);
          setIncome(res.user.wallet);
          setOutstanding(res.outstanding);
          setSpending_limit(res.user.spending_limit);
          setBusinessIsPartner(res.user.businessIsPartner);
          setAvatar(res.user.avatar);
    } else if (res.code === 401) {
    
    }
  });

 


  fetchData(); // Call the asynchronous function
  fetchDatas(); // Call the asynchronous function
}, []);
    

const handleApproveStatus = async (status, subscription_id) => {
  console.log(status)
  console.log(subscription_id)
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      subscription_id: subscription_id, // Use the itemId parameter here
      status: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,
      
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.success(
        'Ordered Product Mark as Paid, Ready for Processing',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setIsLoading(false);
    } else if (response.status === 401) {
      // Handle unauthorized access
    } else {
      // Handle other status codes or errors
    }
  } catch (error) {
    setError('An error occurred while updating the order status.');
   
    toast.error(error, {
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

const handlePendingStatus = async (status, subscription_id) => {
  console.log(status)
  console.log(subscription_id)
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      subscription_id: subscription_id, // Use the itemId parameter here
      status: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    console.log(response.data);

    if (response.status === 200) {
      // Handle a successful response here
      toast.info(
        'Order is awaiting payment',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setIsLoading(false);
    } else if (response.status === 401) {
      // Handle unauthorized access
    } else {
      // Handle other status codes or errors
    }
  } catch (error) {
    setError('An error occurred while updating the order status.');

    toast.error(error, {
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


const handleQueryStatus = async (status, subscription_id) => {
  console.log(status)
  console.log(subscription_id)
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      subscription_id: subscription_id, // Use the itemId parameter here
      status: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,
      
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.success(
        'We are currently processing your order with care',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setIsLoading(false);
    } else if (response.status === 401) {
      // Handle unauthorized access
    } else {
      // Handle other status codes or errors
    }
  } catch (error) {
    setError('An error occurred while updating the order status.');
   
    toast.error(error, {
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

const handleDenyStatus = async (status, subscription_id) => {
  // console.log('deny')
  console.log(status)
  console.log(subscription_id)
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      subscription_id: subscription_id, // Use the itemId parameter here
      status: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,
      
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.success(
        'Order is now in transit and on its way to your location',
        {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        }
      );
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      setIsLoading(false);
    } else if (response.status === 401) {
      // Handle unauthorized access
    } else {
      // Handle other status codes or errors
    }
  } catch (error) {
    setError('An error occurred while updating the order status.');
   
    toast.error(error, {
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

  return (
    <>
    <ToastContainer/>


    <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg">
          <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse absolute right-3 top-3">
          <Link href={`tel:${phone}`}>
            <div className="msg-action-btn">
              <Icon icon="heroicons-outline:phone"  />
            </div>
            </Link>
            <Link href={`mailto:${email}`}>
            <div className="msg-action-btn">
              <Icon icon="humbleicons:mail" />
            </div>
            </Link>
            <Link href={`https://api.whatsapp.com/send/?phone=${phone}`}>
            <div className="msg-action-btn">
              <Icon icon="mdi:whatsapp" />
            </div>
            </Link>
          </div>
          </div>
          
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
              
                <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                   src={ avatar == ""
                                ? "/assets/images/users/user-1.jpg"
                                : avatar
                            }
                    
                    className="w-full h-full object-cover rounded-full"
                  />
                  <div
                   
                    className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  >
                    <Icon icon="heroicons:pencil-square" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {firstname + " " + lastname}
                  <br/>
                  <center>{username} </center>
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                {isBusiness == 1 ?  (
            <div className="inline-block bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
            Business Account
            </div> 
            ):(
              <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              Customer Account
             
            </div>
            )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              <center>
               {naira.format(income)}
              </center>
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>
           
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1 mr-3">
              
              {naira.format(outstanding)}

              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Outstanding
              </div>
            </div>

            <div className="flex-1">

              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1 pr-3">
                {spending_limit}
              </div>
              
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Spending Limit
              </div>
            </div>
            &nbsp;&nbsp;
            <div className="flex-1">

<div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1 pr-3">
{status == 1 ?  (
            <div className=" text-success-500 bg-success-500 px-3 inline-block  min-w-[60px] text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
            Approve
            </div> 
            ):(
              <div className=" text-danger-500 bg-danger-500 px-3 inline-block  min-w-[60px]  text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
             Pending
             
            </div>
            )}
</div>

<div className="text-sm text-slate-600 font-light dark:text-slate-300">
  Kyc Status
</div>
</div>
            <div className="flex-1">
              

              {isBusiness == 1 ?  (
              <>
           
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {businessIsPartner == 1 ?  (
            <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
            Verified
            </div> 
            ):(
              <div className="inline-block bg-danger-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              Unverified
             
            </div>
            )}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Partnership
              </div>
              </>
            ):(

              ""
            )}
             
            </div>

           
         
          </div>
        </div>



      <Card>
        <div className="items-center justify-between mb-6 md:flex">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                      <th scope="col" className="table-th">
                      ID
                    </th>
                      <th scope="col" className="table-th">
                     Customer ID
                    </th>
                    <th scope="col" className="table-th">
                    Package
                    </th>
                    <th scope="col" className="table-th">
                    Price
                    </th>
                    <th scope="col" className="table-th">
                    Package Name
                    </th>
                    <th scope="col" className="table-th">
                    Duration
                    </th>
                    <th scope="col" className="table-th">
                    Interest (%)
                    </th>
                    <th scope="col" className="table-th">
                    Status
                    </th>
                    <th scope="col" className="table-th">
                      Due Date
                    </th>
                    <th scope="col" className="table-th">
                      Date
                    </th>
                    <th scope="col" className="table-th">
                      Action
                    </th>
                    </tr>

               
                </thead>
                {paginatedHistory.map((item) => (
                  <React.Fragment key={item.sub_info?.id}>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span>{item.sub_info?.id}</span></td>
                      <td className="table-td py-2 "> {item.sub_info?.userid} </td>
                        <td className="table-td py-2"> {item.sub_info?.package_} </td>
                        <td className="table-td py-2">  {naira.format(item.sub_info?.price || "0")}</td>
                        <td className="table-td py-2"> {item.package?.package_name } </td>
                        <td className="table-td py-2"> {item.sub_info?.duration } days</td>
                        <td className="table-td py-2"> {item.sub_info?.interest || "0"} </td>
                        <td className="table-td py-2"> 
                        <span className="block w-full">
            <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              item.sub_info?.status_text === "approve"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              item.sub_info?.status_text === "pending"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
                  item.sub_info?.status_text === "queried"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                }
            
            ${
              item.sub_info?.status_text === "denied"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                
             `}
          >
            { item.sub_info?.status_text}
          </span>
          </span>
              </td>
              <td className="table-td py-2">  {formattedDate(item.sub_info?.due_date)} </td>
               <td className="table-td py-2">  {formattedDate(item.sub_info?.created_at)} </td>
             <td className="table-td py-2">                    
        <div>
              <Dropdown
              classMenuItems="right-0 w-[140px] top-[110%] "
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                
                  <Menu.Item
                  onClick={() => handleApproveStatus('approve', item.sub_info.id)} disabled={isLoading}
                  >
                     <div className= "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse"
                 >
                      <span className="text-base">
                        <Icon icon='mdi:approve'/>
                      </span>
                      <span> {isLoading ? 'Updating...' : 'Approve'}</span>
                    </div>
                    
                  </Menu.Item>

                  <Menu.Item
                     onClick={() => handlePendingStatus('pending', item.sub_info.id)} disabled={isLoading}  >
                  
                    <div className= "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse"
                 >
                      <span className="text-base">
                        <Icon icon='material-symbols:pending-actions-rounded'/>
                      </span>
                      <span> {isLoading ? 'Updating...' : 'Pend'}</span>
                    </div>
                    
                  </Menu.Item>
                  <Menu.Item
                   onClick={() => handleQueryStatus('queried', item.sub_info.id)} disabled={isLoading}>
                     <div className= "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse"
                 >
                      <span className="text-base">
                        <Icon icon='streamline:interface-help-question-square-frame-help-mark-query-question-square'/>
                      </span>
                      <span> {isLoading ? 'Updating...' : 'Query'}</span>
                    </div>
                    
                  </Menu.Item>

                  <Menu.Item 
                  onClick={() => handleDenyStatus('denied', item.sub_info.id)} disabled={isLoading}
                   >
                    <div
                      className="bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse " >
                      <span className="text-base">
                        <Icon icon='fluent:shifts-deny-24-regular'/>
                      </span>
                      <span> {isLoading ? 'Updating...' : 'Deny'}</span>
                    </div>
                    
                  </Menu.Item>
              </div>
            </Dropdown>
          </div>

           </td>
          
                </tr>
                    
                </tbody>
                </React.Fragment>
                ))}
                <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                 
                    
              </table>
            </div>
          </div>
        </div>
       
        <div className="items-center justify-between mt-6 space-y-5 md:flex md:space-y-0">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="py-2 form-control w-max"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1); // Reset current page to 1 when changing page size
              }}
            >
              {[10, 25, 50, 100, 500].map((pageSizeOption) => (
                <option key={pageSizeOption} value={pageSizeOption}>
                  Show {pageSizeOption}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page 
              <span>{currentPage} of {totalPages}</span>
            </span>
          </div>
          <ul className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
            </li>

            {getPageNumbers().map((pageNumber) => (
              <li key={pageNumber}>
                <button
                  href="#"
                  aria-current="page"
                  className={`${
                    pageNumber === currentPage
                      ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            ))}

            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        
      


        {/*end*/}
      </Card>
    </>
  );
};


export default AllSubcriptions;
