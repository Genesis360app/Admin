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



const AllSubcriptions = ({ title = ("All Subscriptions"), item }) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const [subByID, setSubByID] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user_id, setUser_id] = useState("");
  const [phone, setPhone] = useState("");
  const [activeModal, setActiveModal] = useState(false);
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

  const userid = "24011343-7323075-4480759";
  
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
      // var userid = localStorage.getItem("userid");

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getSubscription.php?userid=${userid}`, {
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


  const fetchDatas = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getKYC.php?userid=${userid}`, {
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

      

      if (response.data.code === 200) {
        // console.log(response.data);
        // Handle successful response
        setStatus(response.data.kyc.status);
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
  // Use the orderId prop directly
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/orderById.php?orderid=${selectedSub?.sub_info?.userid}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    // console.log(res);
    if (res.code === 200) {
      setSubByID(res.sub);
    } else if (res.code === 401) {
    
    }
  });

  fetchData(); // Call the asynchronous function
  fetchDatas(); 
}, []);
    

const handleApproveStatus = async (status, subscription_id) => {
  
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
    // console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.success(
        'subscription marked as Approved',
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
    // console.log(response.data);

    if (response.status === 200) {
      // Handle a successful response here
      toast.info(
        'subscription marked as Pending',
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
    // console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.warning(
        'subscription has been Queried',
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
    // console.log(response.data);
    if (response.status === 200) {
      // Handle a successful response here
      toast.error(
        'subscription has been Denied',
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

    {/* <Modal className="w-[49%]"
    activeModal={activeModal}
    onClose={() => setActiveModal(false)}
    title="Subscription Details"
    footer={
      <Button
        text="Close"
        btnClass="btn-primary"
        onClick={() => setActiveModal(false)}
        router={router}
      />
    }
  >
     <div>
     <center> 
    
    <Card title=" Status Variation Badges ">


 
        <div className="space-xy-5">

          <Button className="bg-secondary-500 text-white"
           onClick={() => handleApproveStatus('approve', selectedSub.sub_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Approve'}</span>
              <Badge  icon="mdi:approve" className="bg-white text-slate-900 " />
            </div>
          </Button>
          
          <Button className="btn-info"
            onClick={() => handlePendingStatus('pending', selectedSub.sub_info.id)} disabled={isLoading}  >
          
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Pend'}</span>
              <Badge  icon="material-symbols:pending-actions-rounded" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-warning"
          onClick={() => handleQueryStatus('queried', selectedSub.sub_info.id)} disabled={isLoading}>
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Query'}</span>
              <Badge  icon="streamline:interface-help-question-square-frame-help-mark-query-question-square" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-dark"
          onClick={() => handleDenyStatus('denied', selectedSub.sub_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Deny '}</span>
              <Badge  icon="fluent:shifts-deny-24-regular" className="bg-white text-slate-900" />
            </div>
          </Button>
        
       
        </div>
        
</Card>
</center>
</div>
<br/>
        
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
                      Kyc
                    </th>
                   
                    </tr>
                </thead>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span>{selectedSub.sub_info?.id}</span></td>
                      <td className="table-td py-2 "> {selectedSub.sub_info?.userid} </td>
                        <td className="table-td py-2"> {selectedSub.sub_info?.package_} </td>
                        <td className="table-td py-2">  {naira.format(selectedSub.sub_info?.price || "0")}</td>
                        <td className="table-td py-2"> {selectedSub.package?.package_name } </td>
                        <td className="table-td py-2"> {selectedSub.sub_info?.duration } days</td>
                        <td className="table-td py-2"> {selectedSub.sub_info?.interest || "0"} </td>
                        <td className="table-td py-2"> 
                        <span className="block w-full">
            <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              selectedSub.sub_info?.status_text === "approve"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              selectedSub.sub_info?.status_text === "pending"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              selectedSub.sub_info?.status_text === "queried"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                }
            
            ${
              selectedSub.sub_info?.status_text === "denied"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                
             `}
          >
            { selectedSub.sub_info?.status_text}
          </span>
          </span>
                        </td>
              <td className="table-td py-2">  {formattedDate(selectedSub.sub_info?.due_date)} </td>
               <td className="table-td py-2">  {formattedDate(selectedSub.sub_info?.created_at)} </td>
               <td className="table-td py-2">  
               {status == 1 ?  (
            <div className=" text-success-500 bg-success-500 px-3 inline-block  min-w-[60px] text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
            Approve
            </div> 
            ):(
              <div className=" text-danger-500 bg-danger-500 px-3 inline-block  min-w-[60px]  text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
             Pending
             
            </div>
            )}
               </td>

                      </tr>
                      </tbody>
                </table>
                </div>
                </div>
                </div>


                <br/>
               
                         
  </Modal> */}
    
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
                   onClick={() => { setSelectedSub(item);setActiveModal(true); }} disabled={isLoading}
                  >
                     <div className= "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse"
                 >
                      <span className="text-base">
                        <Icon icon='mdi:eye'/>
                      </span>
                      <span> View</span>
                    </div>
                    
                  </Menu.Item>
                  
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
