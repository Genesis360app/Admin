'use client'

import React,{useEffect,useState,useMemo,Fragment} from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@/components/ui/Modal";
import GlobalFilter from "../table/GlobalFilter";
import Button from "@/components/ui/Button";
import { useRouter } from 'next/navigation'
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import axios from 'axios'; // Import Axios at the top of your file
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import Accordion from "@/components/ui/Accordion";





const campaigns = [
    {
      name: "Channel",
      value: "roi",
    },
    {
      name: "Email",
      value: "40%",
    },
    {
      name: "Website",
      value: "28%",
    },
    {
      name: "Facebook",
      value: "34%",
    },
    {
      name: "Offline",
      value: "17%",
    },
  ];

const backgrounds = [
  'https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp',
  'https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp',
  'https://img.pikbest.com/origin/09/07/20/73bpIkbEsT85E.jpg!w700wp',
  'https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp',
  'https://img.pikbest.com/origin/09/05/42/91VpIkbEsTEHU.jpg!w700wp',
  'https://img.pikbest.com/origin/09/05/42/91VpIkbEsTEHU.jpg!w700wp',
  'https://img.pikbest.com/origin/09/05/42/95XpIkbEsTGaW.jpg!sw800',
];



const AllSubcriptions = ({ title = ("Subscriptions"), item }) => {
  const dispatch = useDispatch();
  const router = useRouter()
  const [currentBackground, setCurrentBackground] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [subByID, setSubByID] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [businessIsPartner, setBusinessIsPartner] = useState("");
  const [income, setIncome] = useState("");
  const [wallet, setWallet] = useState("");
  const [spending_limit, setSpending_limit] = useState("");
  const [outstanding, setOutstanding] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isBusiness, setIsbusiness] = useState(null);
  const [status, setStatus] = useState(null);
  const [gender, setGender] = useState("");
  const [remita, setRemita] = useState("");
  const [employment, setEmployment] = useState("");
  const [num, setNum] = useState("");
  const [step, setStep] = useState(0);
  const [pdfpassword, setPdfpassword] = useState("");
  const [bvn, setBvn] = useState("");
  const [dob, setDOB] = useState("");
  const [id, setId] = useState("");
  const [kycdate, setKycdate] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [marital, setMarital] = useState("");
  const [maiden, setMaiden] = useState("");
  const [proof, setProof] = useState("");
  const [proof_id, setProof_id] = useState("");
  const [bank_statement, setBank_statement] = useState("");
  const [street, setStreet] = useState("");
  const [userToken, setUserToken] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [account_number, setAccount_number] = useState("");
  const [bank_name, setBank_name] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [disabled_, setDisabled] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [businessAddress, setBusinessAddress] = useState(null);
  const [businessCategory, setBusinessCategory] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [created_at, setCreated_at] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [town, setTown] = useState("");
  const [referralcode, setReferralcode] = useState("");
  const [refby, setRefby] = useState("");
  const [priceTotal, setPriceTotal] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [activeModal, setActiveModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [history_activeModal, setHistory_activeModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
 
  const userid = "57217385-12727257-895887621";
  
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


// Function to filter subscription data based on globalFilter value
const filteredData = useMemo(() => {
return (last25Items  || []).filter((item) => {
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

const filteredhistory = useMemo(() => {
    return (history || []).filter((item) => {
      const transaction_ref = (item?.transaction_ref|| "").toString(); // Access product_name safely and convert to lowercase
      const txn_Id = (item?.id || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.created_at)|| "").toString(); // Access package_id safely and convert to string
    
      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";
    
      // Customize this logic to filter based on your specific requirements
      return (
        transaction_ref.includes(filterText.toLowerCase()) ||
        txn_Id.includes(filterText)||
        date.includes(filterText)
      );
    });
    }, [history, globalFilter]);
    
const filteredOrder = useMemo(() => {
    return (orderItems || []).filter((item) => {
      const transaction_ref = (item?.transaction_ref|| "").toString(); // Access product_name safely and convert to lowercase
      const txn_Id = (item?.id || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.created_at)|| "").toString(); // Access package_id safely and convert to string
    
      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";
    
      // Customize this logic to filter based on your specific requirements
      return (
        transaction_ref.includes(filterText.toLowerCase()) ||
        txn_Id.includes(filterText)||
        date.includes(filterText)
      );
    });
    }, [orderItems, globalFilter]);
    


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
const paginatedSubscription = filteredData.slice(startIndex, endIndex);
const paginatedHistory = filteredhistory.slice(startIndex, endIndex);
const paginatedOrder = filteredOrder.slice(startIndex, endIndex);

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

const isOrderEmpty = orderItems.length === 0;
const isSubEmpty = subByID.length === 0;
const isHistoryEmpty = history.length === 0;



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
            setBank_statement(response.data.bank_statement_pdf);
            setStatus(response.data.kyc.status);
            setIncome(response.data.kyc.income);
            setGender(response.data.kyc.gender);
            setIncome(response.data.kyc.income);
            setRemita(response.data.kyc.remita);
            setMarital(response.data.kyc.marital);
            setMaiden(response.data.kyc.maiden);
            setDOB(response.data.kyc.dob);
            setKycdate(response.data.kyc.created_at);
            setEmployment(response.data.kyc.employment);
            setNum(response.data.kyc.family_num);
            setProof(response.data.kyc.proof);
            setPdfpassword(response.data.kyc.statment_of_account_passcode);
            setEmployment(response.data.kyc.employment);
            setState(response.data.kyc.state);
            setCity(response.data.kyc.city);
            setStep(response.data.kyc.step);
            setStreet(response.data.kyc.street);
            setState(response.data.kyc.state)
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
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    
    console.log(res);
    if (res.code === 200) {
          setFirstname(res.user.first_name);
          setEmail(res.user.email);
          setId(res.user.id);
          setCustomerID(res.user.user_id);
          setUsername(res.user.username);
          setLastname(res.user.last_name);
          setPhone(res.user.phone);
          setIsbusiness(res.user.isBusiness);
          setWallet(res.user.wallet);
          setOutstanding(res.outstanding);
          setSpending_limit(res.user.spending_limit);
          setBusinessIsPartner(res.user.businessIsPartner);
          setAvatar(res.user.avatar);
          setBusinessCategory(res.user.businessCategory);
          setBusinessName(res.user.businessName);
          setBusinessAddress(res.user.businessAddress);
          setReferralcode(res.user.user_ref_id);
          setRefby(res.user.referral_id);
          setRcNumber(res.user.rcNumber);
          setBank_name(res.user.bank_name);
          setAccount_number(res.user.account_number);
    } else if (res.code === 401) {
    
    }
  });

  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getProof?userid=${userid}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
    })
    .then(response => response.json())
    .then((res) => {
    // console.log(res);
    if(res.code == 200){
        setProof_id(res.temp_url);

      }else if(res.code == 401){
      }
    })

    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Wallet/History.php?user_id=${userid}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
    })
    .then(response => response.json())
    .then((res) => {
    // console.log(res);
    if(res.code == 200){
        setHistory(res.history);   
      }else if(res.code == 401){
        toast.info(`An error occurred, please login again`, {
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
    })




    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getOrders.php?userid=${userid}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
        })
        .then(response => response.json())
        .then((res) => {
        // console.log(res);
        if(res.code == 200){
            // console.log("Orders");
            // console.log(res)
            setOrderItems(res.cart)
            setPriceTotal(res.total)
          }else if(res.code == 401){
            
          }
        })

  fetchData(); // Call the asynchronous function
  fetchDatas(); 
}, []);
    

const handleApprovekyc = async (status, id) => {
  
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      userid: id, // Use the itemId parameter here
      action: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/kyc.php`,
      
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    console.log(response.data);
    if (response.code === 200) {
      // Handle a successful response here
      toast.success("User KYC approved successfully", {
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

const handleDisapprovekyc = async (status, id) => {
  
  setIsLoading(true);
  try {
    const token = localStorage.getItem('token'); // Replace with your authentication method
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const body = {
      userid: id, // Use the itemId parameter here
      action: status, // Use the status parameter here
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/kyc.php`,
      
      body,
      { headers, cache: 'no-store' }
    );

    // Handle the response as needed
    // console.log(response.data);
    if (response.code === 200) {
      // Handle a successful response here
      toast.success(
        'User KYC has been Disapproved successfully',
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

const RadarChart = () => {
    const [isDark] = useDarkMode();
    const series = [67];
    const options = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "22px",
              color: isDark ? "#E2E8F0" : "#475569",
            },
            value: {
              fontSize: "16px",
              color: isDark ? "#E2E8F0" : "#475569",
            },
            total: {
              show: true,
              label: "Balance",
              color: isDark ? "#E2E8F0" : "#475569",
              formatter: function () {
                return (naira.format(wallet));
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      colors: ["#4669FA"],
    };
  
    return (
      <div>
        <Chart series={series} options={options} type="radialBar" height="210" />
      </div>
    );
  };


  const files = [
  
    {
      img: "/assets/images/icon/pdf-1.svg",
      title: "Account Statement.pdf",
      date: (formattedDate(created_at)),
      link:(bank_statement),
    },
    {
        img: "/assets/images/icon/pdf-2.svg",
      title: "Remita Mandate Form.pdf",
      date: (formattedDate(created_at)),
      link:(remita),
    },

    {
        img: "/assets/images/icon/scr-1.svg",
        title: "Proof of Identity.jpg",
        date: (formattedDate(created_at)),
        link:(proof_id),
      },
   
    // {
    //   img: "/assets/images/icon/pdf-2.svg",
    //   title: "Proof of Identity.pdf",
    //   date: (formattedDate(created_at)),
    //   link:"go",
    // },
   
  ];
// background changes

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground((prevBackground) =>
        (prevBackground + 1) % backgrounds.length
      );
    }, 60000); // Change every 1 minute (in milliseconds)

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <>
    <ToastContainer/>
    <Modal
        activeModal={history_activeModal}
        onClose={() => setHistory_activeModal(false)}
        title="Transaction Details"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setHistory_activeModal(false)}
          />
        } >
          <div>
                <div className="flex justify-between mt-[40px]">
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold">Transaction ID</h2>
                    <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                      # {selectedHistory?.id}
                    </p>
                  </div>
                  <div>
  <h2 className="text-[20px] leading-[25px] font-bold text-right">Transaction Date</h2>
<p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
  {(() => {
    const rawDate = selectedHistory?.created_at;
    const date = new Date(rawDate);
    return !isNaN(date.getTime()) ? (
      <>
        {new Intl.DateTimeFormat('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }).format(date)}
      </>
    ) : (
      <span>Invalid Date</span>
    );
  })()}
</p>
</div>

                </div>

                <div className="flex justify-between mt-[30px]">
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold">Transaction Ref</h2>
                    <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                      {selectedHistory?.transaction_ref}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold text-right">Amount</h2>
                    <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                       {naira.format(selectedHistory?.amount)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-[30px]">
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold">Description</h2>
                    <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                      {selectedHistory?.remark}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold text-right">Transaction Type</h2>
                    <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                      {selectedHistory?.txn_type}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between mt-[30px] items-center">
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold">Transaction Status</h2>
                    <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                      {selectedHistory?.status}
                    </p>
                  </div>
                  <div>
                    <h2 className="text-[20px] leading-[25px] font-bold text-right">User ID</h2>
                    <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                      {selectedHistory?.userid}
                    </p>
                  </div>
                </div>
              </div>
      </Modal>
      


    <Modal 
    activeModal={activeModal}
    onClose={() => setActiveModal(false)}
    title="Transaction Details"
    footer={
      <Button
        text="Close"
        btnClass="btn-primary"
        onClick={() => setActiveModal(false)}
        router={router}
      />
    }
  >
   
                <div className="w-full px-2 ml-auto">
  <div className="bg-[#ffffe6] rounded-lg shadow-[0px_0px_2px_#0000004D] px-4 py-4 flex items-start justify-start">
    <div className="flex-1">
      
    <p className="text-[32px] font-bold leading-[40px] mt-[5px] text-[#585820]">
        Shipping Information
      </p>
      <br/>
      <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
     <b>Shipping Address</b> {landmark}
      </h2>
      <br/>
      <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
      <b>House Number :</b> {houseNumber + " " + streetAddress }
      </h2>
      <br/>
      <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
      <b>State :</b> {town + " " + shippingState}
      </h2>
      <br/>
      <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
      <b>Contact Number :</b>{contactPhone}
      </h2>
      
    </div>
    <div className="text-4xl text-blue-400">
    {/* <Icon icon="heroicons:pencil-square" className="text-[#1c404d] w-7 h-8 cursor-pointer"  onClick={handlePrint} />
       */}
    </div>
  </div>
</div>
                         
  </Modal>

    <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-[#000000] lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
    <div
  className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"
  style={{
backgroundImage: `url(${backgrounds[currentBackground]})`,
backgroundRepeat: 'no-repeat',
backgroundSize: 'cover', 
}}
>
 
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
           
            <div className="msg-action-btn" onClick={() => {setActiveModal(true)}}  >
              <Icon icon="la:shipping-fast" />
            </div>
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
                  <div className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]" >
                    {id}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                  {firstname + " " + lastname}
                  <br/>
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
               {account_number}
              </center>
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Account Number
              </div>
            </div>
           &nbsp; &nbsp; &nbsp;
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1 mr-3">
              
              {bank_name}

              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Bank Name
              </div>
            </div>

            
            &nbsp;&nbsp; &nbsp;
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
        <center>
          <Button
            icon="mdi:approve"
            text="Approve Kyc"
            onClick={() => handleApprovekyc('approve', CustomerID)} disabled={isLoading}
            className="btn-success "
          />
          &nbsp;&nbsp;&nbsp;
           <Button
            icon="subway:error"
            text="Disapprove Kyc"
            onClick={() => handleDisapprovekyc('0', CustomerID)} disabled={isLoading}
            className="btn-danger "
          />

          </center>
        <div className="grid grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info" >
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {email}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="mdi:rename" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Username
                    </div>
                      {username}
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                     href={`tel:${phone}`}
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {phone}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                   {street+ ","+city+ ","+ state }
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
         
          <div className="xl:col-span-4 lg:col-span-5 col-span-12 ">
          <Card title="Files" className="h-[394px]">
            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
              {files.map((item, i) => (
                <li key={i} className="block py-[8px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                      <div className="flex-none">
                        <div className="h-8 w-8">
                          <img
                            src={item.img}
                            alt=""
                            className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="block text-slate-600 text-sm dark:text-slate-300">
                          {item.title}
                        </span>
                        <span className="block font-normal text-xs text-slate-500 mt-1">
                          {item.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex-none">
                    <Link href={item.link} target="_blank" rel="noopener noreferrer">
                    <button type="button" className="text-xs text-slate-900 dark:text-white">
                     Download
                    </button>
                    </Link>
                    </div>
                  </div>
                </li>
               
                
              ))}
            </ul>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Account Overview" >
            <RadarChart />
            <div className="bg-slate-50 dark:bg-slate-900 rounded p-4 mt-8 flex justify-between flex-wrap">
              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Monthly Income
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                 {naira.format(income)}
                </div>
                <div className="text-slate-500 dark:text-slate-300 text-xs font-normal">
                {formattedDate(kycdate)}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal justify-center items-center">
                  Outstanding
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white justify-center items-center " >
                {naira.format(outstanding)}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Spending Limit
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                {spending_limit} %
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
            <div className="lg:col-span-4 col-span-12 space-y-5">
              <Card title="Kyc information">
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Name</span>
                      <span>Details</span>
                    </div>
                  </li>
                  
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Employment</span>
                      <span>{employment}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Date of Birth</span>
                      <span>{formattedDate(dob)}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Marital Status</span>
                      <span>{marital}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Maidens Name</span>
                      <span>{maiden}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Family Number</span>
                      <span>{num}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Gender</span>
                      <span>{gender}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Proof of Identity</span>
                      <span>{proof}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Pdf Password</span>
                      <span>{pdfpassword}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Rc Number</span>
                      <span>{rcNumber}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Referral Code</span>
                      <span>{referralcode}</span>
                    </div>
                  </li>
                  <li  className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase" >
                    <div className="flex justify-between">
                      <span>Referred By</span>
                      <span>{refby}</span>
                    </div>
                  </li>
               
              </ul>
              </Card>
              
            </div>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={417} />
            </Card>
          </div>
          <div className="lg:col-span-full col-span-12">
          <Card title= {firstname +"  "+ "Activities"} >
        <Tab.Group>
          <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` inline-flex items-start text-sm font-medium mb-7 capitalize bg-white dark:bg-slate-800 ring-0 foucs:ring-0 focus:outline-none px-2  transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              
              ${
                selected
                  ? "text-primary-500 before:w-full"
                  : "text-slate-500 before:w-0 dark:text-slate-300"
              }
              `}
                  >
                    <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                      <Icon icon={item.icon} />
                    </span>
                    {item.title}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{firstname} transactions</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>

        
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            {isHistoryEmpty ? ( // Conditionally rendering based on cart items
          <center>
            <h4 className="mt-10 text-2xl font-bold text-primary">No Available Transaction History Data</h4>
          </center>
        ) : (
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr >
                    <th scope="col" className="table-th">
                      ID
                    </th>
                    <th scope="col" className="table-th">
                    Amount
                    </th>
                    <th scope="col" className="table-th">
                    Txn Type
                    </th>
                    <th scope="col" className="table-th">
                    Remark
                    </th>
                    <th scope="col" className="table-th">
                    Reference Id
                    </th>
                    <th scope="col" className="table-th">
                    Status
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
                  <React.Fragment key={item.id}>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >

                      <tr >
                        <td className="table-td py-2"> <span>{item.id}</span></td>
                        <td className="table-td py-2"> {item.amount}</td>
                        <td className="table-td py-2"> {item.txn_type} </td>

                        <td className="table-td py-2"> 
                        <span className="text-slate-500 dark:text-slate-400">
                <span className="block text-slate-600 dark:text-slate-300">
                {item.remark}
                </span>
              </span>
              </td>
                        <td className="table-td py-2">  
                         <span className="text-slate-500 dark:text-slate-400">
                <span className="block text-xs text-slate-500">
                  Trans ID: {item.transaction_ref}
                </span>
              </span> 
              </td>
                        <td className="table-td py-2"> <span className="block w-full">
                <span
                  className={`${
                    item.status === "Completed" ? "text-success-500 " : ""} 
                  ${item.status === "Pending" ? "text-warning-500 " : ""}
                  ${item.status=== "Canceled" ? "text-danger-500" : ""}
                  
                   `}
                >
                  {item.status}
                
                </span>
              </span>
              </td>
                        <td className="table-td py-2">  {formattedDate(item.created_at)}</td>
                        <td className="table-td py-2"> 
                        <div className="flex space-x-3 rtl:space-x-reverse">
                <Tooltip content="View" placement="top" arrow animation="shift-away">
                  <button
                    className="action-btn"
                    type="button"
                    onClick={() => {
                      setSelectedHistory(item);
                      setHistory_activeModal(true);
                    }}
                  >
                    <Icon icon="heroicons:eye" />
                  </button>
                </Tooltip>
                {/* {row.cell.value} */}
    
            </div>
                        </td>
                       
                      </tr>
                   
                </tbody>
                </React.Fragment>
                ))}
              </table>
              )}
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
                </Card>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <Card>
        <div className="items-center justify-between mb-6 md:flex">
          <h4 className="card-title">{firstname+ " " + title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            {isSubEmpty ? ( // Conditionally rendering based on cart items
          <center>
            <h4 className="mt-10 text-2xl font-bold text-primary">No Available Subscription Data</h4>
          </center>
        ) : (
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                      <th scope="col" className="table-th">
                      ID
                    </th>
                      {/* <th scope="col" className="table-th">
                     Customer ID
                    </th> */}
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
                {paginatedSubscription.map((item) => (
                  <React.Fragment key={item.sub_info?.id}>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span>{item.sub_info?.id}</span></td>
                      {/* <td className="table-td py-2 "> {item.sub_info?.userid} </td> */}
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
              )}
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
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
              <Card>
        <div className="items-center justify-between mb-6 md:flex">
          <h4 className="card-title">{firstname+ " " +" Orders"}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            {isOrderEmpty ? ( // Conditionally rendering based on cart items
          <center>
            <h4 className="mt-10 text-2xl font-bold text-primary">No Available Order Items Data</h4>
          </center>
        ) : (
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
                    Image
                    </th>
                    <th scope="col" className="table-th">
                    Product Name
                    </th>
                    <th scope="col" className="table-th">
                    Price
                    </th>
                    <th scope="col" className="table-th">
                    Payment Channel
                    </th>
                    <th scope="col" className="table-th">
                    Qty
                    </th>
                    <th scope="col" className="table-th">
                    Status
                    </th>
                    <th scope="col" className="table-th">
                      Date
                    </th>
                    <th scope="col" className="table-th">
                      Action
                    </th>
                    </tr>

               
                </thead>
                {paginatedOrder.map((item) => (
                  <React.Fragment key={item.cart_info?.id}>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span>{item.cart_info?.id}</span></td>
                      <td className="table-td py-2 "> {item.cart_info?.userid} </td>
                      <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                        <img
                            className="w-20 h-20 rounded"
                            src={
                              item.product === null
                                ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                                : item.product?.image
                            }
                            width={70}
                            height={70}
                            alt=""
                          />
                          </td>
                        
                        <td className="table-td py-2"> {item.product?.product_name} </td>
                        <td className="table-td py-2">  {naira.format(item.product?.price || "0")}</td>
                        <td className="table-td py-2"> BNPL </td>
                        <td className="table-td py-2"> {item.cart_info?.qty || "0"} </td>
                        <td className="table-td py-2"> 
                        <span className="block w-full">
            <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              item.order_tracking?.current_status.name === "delivered"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              item.order_tracking?.current_status.name === "closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  item.order_tracking?.current_status.name=== "pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                  item.order_tracking?.current_status.name === "in-transit"
                ? "text-primary-500 bg-primary-500"
                : ""
            }
            
             `}
          >
            {item.order_tracking?.current_status.name}
          </span>
          </span>
              </td>

                        <td className="table-td py-2">  {formattedDate(item.cart_info?.created_at)} </td>

                        <td className="table-td py-2">  <div className="flex space-x-3 rtl:space-x-reverse">
                            {/* <Tooltip content="View" placement="top" arrow animation="shift-away">
                            
                              <button className="action-btn" 
                              type="button"
                              onClick={() => {
                                setSelectedOrder(item);
                                 setActiveModal(true);
                             }}
                              >
                                <Icon icon="heroicons:eye" />
                              </button>
                            
                            </Tooltip> */}
             
                            <Tooltip content="Edit" placement="top" arrow animation="shift-away">
                            
                            
                            <button className="action-btn" 
                          //  onClick={() => router.push(`/order/${item.cart_info.id}`)}
                          onClick={() => handleClick(item)}
                            type="button">
                             <Icon icon="heroicons:pencil-square" />
                           </button>
                           
                         </Tooltip>

                            </div>
                            </td>
                      </tr>
                    
                </tbody>
                
                </React.Fragment>
                ))}
              </table>
              )}
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
      <p>Total Amount : <b>{naira.format(priceTotal)}</b> </p>
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
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et.
                Sunt qui esse pariatur duis deserunt mollit dolore cillum minim
                tempor enim. Elit aute irure tempor cupidatat incididunt sint
                deserunt ut voluptate aute id deserunt nisi.
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </Card>
      </div>
        </div>
        {isBusiness == 0 ? ( // Conditionally rendering based on cart items
          <center>
            <h4 className="mt-10 text-2xl font-bold text-primary">Not a Business Account</h4>
          </center>
        ) : (
        <div>
        <center>
        <Button
            icon="mdi:approve"
            text="Approve Business"
            className="btn-outline-success "
          />
          &nbsp;&nbsp;&nbsp;
           <Button
            icon="subway:error"
            text="Disapprove Business"
            className="btn-outline-danger "
          />
         
        </center>
        <br/>
        
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="ic:round-add-business" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
               Business Name
              </div>
            </div>
            <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
             {businessName}
            </div>
           
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 items-center rtl:space-x-reverse">
              <div className="flex-none h-8 w-8 rounded-full bg-primary-500 text-slate-300 flex flex-col items-center justify-center text-lg">
                <Icon icon="carbon:category-new-each" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
              Business Category
              </div>
            </div>
            <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
             {businessCategory}
            </div>
           
          </div>
        </Card>
        <Card>
          <div className="space-y-6">
            <div className="flex space-x-3 rtl:space-x-reverse items-center">
              <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                <Icon icon="entypo:address" />
              </div>
              <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
              Business Address
              </div>
            </div>
            <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
            {businessAddress}
            </div>
            
              {/* <span>{busi}</span>  */}
           
          </div>
        </Card>
      </div>
    </div>
    )}
    </>
  );
};

const buttons = [
    {
      title: "Transactions",
      icon: "tdesign:undertake-transaction",
    },
    {
      title: "Subscriptions",
      icon: "eos-icons:subscriptions-created-outlined",
    },
    {
      title: "Order",
      icon: "akar-icons:shipping-box-v1",
    },
    {
      title: "Account Info",
      icon: "emojione-monotone:bank",
    },
  ];
  const items = [
    {
      title: "How does Dashcode work?",
      content:
        "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
    },
    {
      title: "Where i can learn more about using Dashcode?",
      content:
        "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
    },
    {
      title: "Why Dashcode is so important?",
      content:
        "Jornalists call this critical, introductory section the  and when bridge properly executed, it's the that carries your reader from anheadine try at attention-grabbing to the body of your blog post.",
    },
  ];
export default AllSubcriptions;
