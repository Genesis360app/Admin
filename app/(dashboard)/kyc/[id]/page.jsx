"use client";

import React, { useEffect, useState, useMemo, Fragment, useRef } from "react";
import { advancedTable } from "../../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Map from "@/components/partials/table/Map";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import axios from "axios"; // Import Axios at the top of your file
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import useDarkMode from "@/hooks/useDarkMode";
import { Tab, Disclosure, Transition } from "@headlessui/react";
import Accordion from "@/components/ui/Accordion";
import { InfinitySpin } from "react-loader-spinner";
import { userService } from "@/services/users.service";
import { useParams } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
import {
  GoogleMap,
  Marker,
  Circle,
  Autocomplete,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
// import { TfiLocationArrow, TfiTime } from 'react-icons/tfi';

const backgrounds = [
  "https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp",
  "https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp",
  "https://img.pikbest.com/origin/09/07/20/73bpIkbEsT85E.jpg!w700wp",
  "https://img.pikbest.com/origin/09/05/42/54gpIkbEsT8SV.jpg!w700wp",
  "https://img.pikbest.com/origin/09/05/42/91VpIkbEsTEHU.jpg!w700wp",
  "https://img.pikbest.com/origin/09/05/42/91VpIkbEsTEHU.jpg!w700wp",
  "https://img.pikbest.com/origin/09/05/42/95XpIkbEsTGaW.jpg!sw800",
];

const AllSubcriptions = ({ title = "Loans", item, params }) => {
  const getStatus = (status) => {
    switch (status) {
      case "Pending":
        return "pending-100";
      case "Paid":
        return "primary-100";
      case "Processing":
        return "processing-100";
      case "In-Transit":
        return "gray-100";
      case "Delivered":
        return "success-100";
      case "Closed":
        return "danger-200";
      default:
        return "";
    }
  };





  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = params;
  // handleClick to view project single page
  const handleClick = async (item) => {
    router.push(`/order/${item?.id}`);
  };
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
  const [isVerified, setIsVerified] = useState(null);
  const [income, setIncome] = useState("");
  const [wallet, setWallet] = useState("");
  const [spending_limit, setSpending_limit] = useState("");
  const [outstanding, setOutstanding] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isBusiness, setIsbusiness] = useState(null);
  const [gender, setGender] = useState("");
  const [remita, setRemita] = useState("");
  const [num, setNum] = useState("");
  const [bvn, setBvn] = useState("");
  const [dob, setDOB] = useState("");
  const [kycdate, setKycdate] = useState("");
  const [CustomerID, setCustomerID] = useState("");
  const [marital, setMarital] = useState("");
  const [maiden, setMaiden] = useState("");
  const [proof, setProof] = useState("");
  const [proof_id, setProof_id] = useState("");
  const [bank_statement, setBank_statement] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [account_number, setAccount_number] = useState("");
  const [bank_name, setBank_name] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [created_at, setCreated_at] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [town, setTown] = useState("");
  const [isCreated, setIsCreated] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [nationality, setNationality] = useState("");
  const [images, setImages] = useState();
  const [businessinfo, Setbusinessinfo] = useState("");
  const [referralcode, setReferralcode] = useState("");
  const [refby, setRefby] = useState("");
  const [priceTotal, setPriceTotal] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [lat, setLat] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [currentPosition, setCurrentPosition] = useState(null);
  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null); // Replace 'any' with the appropriate type
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [long, setLong] = useState("");
  const [activeModal, setActiveModal] = useState(false);
  const [history, setHistory] = useState([]);
  const [loan, setLoan] = useState([]);
  const [history_activeModal, setHistory_activeModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [step, setStep] = useState(0);
  const [delete_orderModal, setDelete_orderModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status_, setStatus_] = useState("");
  const orderStatus = getStatus(status_);
  const [isChecked, setIsChecked] = useState(false);
  
  const [kycId, setKycId] = useState("");
  const [kycStatus, setKycStatus] = useState("");


  const [isusername, setIsusername] = useState("");
  const [isfirstname, setIsfirstname] = useState("");
  const [islastname, setIslastname] = useState("");
  const [isemail, setIsemail] = useState("");
  const [isphone, setIsphone] = useState("");
  const [isBusinessDefault, setBusinessDefault] = useState(false);
  const [password, setPassword] = useState("");


  const handleToggleChange = () => {
    setIsChecked(!isChecked);
    setBusinessDefault(!isChecked);
  };

  // Function to format date value
  function formattedDate(rawDate) {
    const date = new Date(rawDate);

    if (!isNaN(date.getTime())) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        // second: '2-digit',
        hour12: true, // Use 24-hour format
      };

      const formattedDate = date.toLocaleString(undefined, options);
      return <span>{formattedDate}</span>;
    } else {
      return <span>Invalid Date</span>;
    }
  }

  const steps = [
    "Pending",
    "Paid",
    "Processing",
    "In-transit",
    "Delivering",
    "Complete",
  ];
  const statusIndex = steps.indexOf(orderStatus);

  const handlePrint = () => {
    window.print();
  };

  const last25Items = subByID;

  // Sort the last 25 items by the 'id' property in ascending order
  last25Items.sort((a, b) => {
    const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
    const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

    return idB - idA; // Sort in ascending order by 'id'
  });

  // Function to filter subscription data based on globalFilter value
  const filteredData = useMemo(() => {
    return (last25Items || []).filter((item) => {
      const sub_id = (item.sub_info?.id || "").toString(); // Access product_name safely and convert to lowercase
      const status_text = (item.sub_info?.status_text || "").toString(); // Access package_id safely and convert to string
      const package_name = (item.package?.package_name || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        sub_id.includes(filterText.toLowerCase()) ||
        status_text.includes(filterText) ||
        package_name.includes(filterText)
      );
    });
  }, [subByID, globalFilter]);

  const filteredhistory = useMemo(() => {
    return (history || []).filter((item) => {
      const transaction_ref = (item?.description || "").toString(); // Access product_name safely and convert to lowercase
      const amount = (item?.amount || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.created_at) || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        transaction_ref.includes(filterText.toLowerCase()) ||
        amount.includes(filterText) ||
        date.includes(filterText)
      );
    });
  }, [history, globalFilter]);

  const filteredOrder = useMemo(() => {
    return (orderItems || []).filter((item) => {
      const cart_id = (item?.id || "").toString(); // Access product_name safely and convert to lowercase
      const username = (item.user?.username || "").toString(); // Access package_id safely and convert to string
      const mobile_number = (item?.phone || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        cart_id.includes(filterText.toLowerCase()) ||
        username.includes(filterText) ||
        mobile_number.includes(filterText)
      );
    });
  }, [orderItems, globalFilter]);

  const filteredLoan = useMemo(() => {
    return (loan || []).filter((item) => {
      const amount = (item?.amount || "").toString(); // Access product_name safely and convert to lowercase
      const status = (item?.status || "").toString(); // Access package_id safely and convert to string
      const outstanding = (item?.outstanding || "").toString(); // Access package_id safely and convert to string
      const user = (item?.user || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        user.includes(filterText.toLowerCase()) ||
        outstanding.includes(filterText) ||
        status.includes(filterText) ||
        status.includes(filterText) ||
        amount.includes(filterText)
      );
    });
  }, [loan, globalFilter]);

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredhistory.length / itemsPerPage)) {
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
  const endIndex = Math.min(startIndex + itemsPerPage, filteredhistory.length);

  // Get the paginated history data for the current page
  const paginatedSubscription = filteredOrder.slice(startIndex, endIndex);
  const paginatedHistory = filteredhistory.slice(startIndex, endIndex);
  const paginatedOrder = filteredOrder.slice(startIndex, endIndex);
  const paginatedLoan = filteredLoan.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredhistory.length / itemsPerPage);

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
  const isLoanEmpty = loan.length === 0;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Provide a default value if the environment variable is not defined
    libraries: ["places"],
  });


  useEffect(() => {
    const userById = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User token not found");
        }

        const user = JSON.parse(userString);

        if (!user || !user.token || !user.userId) {
          throw new Error("Invalid user data");
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data) {
          const userinfo = response.data.data.user;
          const userwallet = response.data.data.wallet;
          Setbusinessinfo(response.data.data.business);
          // console.log(response);
          // console.log(id);
          setFirstname(userinfo.first_name);
          setLastname(userinfo.last_name);
          setEmail(userinfo.email);
          setUsername(userinfo.username);
          setPhone(userinfo.phone);
          setAvatar(userinfo.image);
          setReferralcode(userinfo.ref_id);
          setIsbusiness(userinfo.isBusiness);
          setIsVerified(userinfo.isVerified);
          setIsCreated(userinfo.updatedAt);
          setIsCreated(userinfo.updatedAt);
          setAccount_number(userwallet.accountNo);
          setBank_name(userwallet.bankName);
          setAccountName(userwallet.accountName);
          setWallet(userwallet.balance);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };

    const userKyc = async (id) => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User token not found");
        }

        const user = JSON.parse(userString);

        if (!user || !user.token || !user.userId) {
          throw new Error("Invalid user data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/kyc/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.data) {
          // Handle response data
          const userKyc = response.data.data;
          const userinfo2 = response.data.data.user;
          setKycId(userKyc.id);status
          setKycStatus(userKyc.status);
          setGender(userKyc.gender);
          setIncome(userKyc.monthlyIncome);
          setMarital(userKyc.maritalStatus);
          setMaiden(userKyc.motherMaidenName);
          setDOB(userKyc.dateOfBirth);
          setOutstanding(userinfo2.loanOutstanding);
          setSpending_limit(userinfo2.loanLimit);
          setProof(userKyc.idType);
          setIdNumber(userKyc.idNumber);
          setIssueDate(userKyc.issueDate);
          setExpiryDate(userKyc.expiryDate);
          setNum(userKyc.householdNo);
          setRefby(userinfo2.ref_code);
          setBvn(userKyc.bvn);
          setState(userKyc.state);
          setCity(userKyc.city);
          setNationality(userKyc.nationality);
          setImages(userKyc.images);
          setStreet(userKyc.address);
          setStep(response.status);
          // console.log('Test Data', response);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
        // Handle error
      }
    };
    const userOrder = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User token not found");
        }

        const user = JSON.parse(userString);

        if (!user || !user.token || !user.userId) {
          throw new Error("Invalid user data");
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/order/get/usersorders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.data) {
          // Handle response data
          // console.log(response.data.data);
          setOrderItems(response.data.data);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
        // Handle error
      }
    };

    const userTransaction = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User token not found");
        }

        const user = JSON.parse(userString);

        if (!user || !user.token || !user.userId) {
          throw new Error("Invalid user data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/transaction/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.data) {
          // Handle response data
          // console.log(response.data.transactions);
          setHistory(response.data.transactions);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
        // Handle error
      }
    };
    const userLoan = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error("User token not found");
        }

        const user = JSON.parse(userString);

        if (!user || !user.token || !user.userId) {
          throw new Error("Invalid user data");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/loan/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response.data) {
          // Handle response data
          // console.log(response.data);
          setLoan(response.data);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
        // Handle error
      }
    };

    // Assuming `id` is defined somewhere
    userKyc(id);
    userLoan();
    userById();
    userOrder();
    userTransaction();
  }, []); // Make sure to include userId in the dependency array

  function formattedDate(rawDate) {
    const date = new Date(rawDate);

    if (!isNaN(date.getTime())) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        // second: '2-digit',
        hour12: true, // Use 24-hour format
      };

      const formattedDate = date.toLocaleString(undefined, options);
      return <span>{formattedDate}</span>;
    } else {
      return <span>Invalid Date</span>;
    }
  }



  const UpdateProfile = async () => {
    setIsLoading(true);
    try {
      const userString = localStorage.getItem("user");

      if (!userString) {
        throw new Error("User token not found");
      }

      const user = JSON.parse(userString);

      if (!user || !user.token || !user.userId) {
        throw new Error("Invalid user data");
      }
      // console.log(user.userId);
      // console.log(user.token);
      const formData = new FormData();
      formData.append("username", isusername);
      formData.append("first_name", isfirstname);
      formData.append("last_name", islastname);
      formData.append("email", isemail);
      formData.append("phone", isphone);
      formData.append("password", password);
      formData.append("isBusiness", isBusinessDefault);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/update_user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          method: "PUT",
          body: formData,
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (response.status === 200) {
        setSuccess("Profile updated successfully");
        _notifySuccess("Profile updated successfully");
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      console.error("Error during onSuccess:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    setIsLoading(true);
    try {
      const userString = localStorage.getItem("user");
  
      if (!userString) {
        throw new Error("User token not found");
      }
  
      const user = JSON.parse(userString);
  
      if (!user || !user.token || !user.userId) {
        throw new Error("Invalid user data");
      }
      const userById = selectedOrder?.id;
      console.log(userById);
            console.log(user.token);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/${userById}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          method: "DELETE",
        }
      );
      const responseData = await response.json();
  
      if (response.status === 200) {
        _notifySuccess(responseData.message);
        setSuccess(responseData.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(responseData.message);
      }
    } catch (error) {
      console.error("Error during oder deletion:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBackground(
        (prevBackground) => (prevBackground + 1) % backgrounds.length
      );
    }, 60000); // Change every 1 minute (in milliseconds)

    return () => {
      clearInterval(interval); // Clear the interval when the component unmounts
    };
  }, []);

  const [mapCenter, setMapCenter] = useState({
    lat: 9.6000359,
    lng: 7.9999721,
  });
  const originRef = useRef(null); // Make sure you initialize the ref properly
  const destinationRef = useRef(null); // Make sure you initialize the ref properly
  const circleRadius = 100;

  if (!isLoaded) {
    return (
      <div>
        <center>
          <InfinitySpin width="200" color="#00b09b" />
        </center>
      </div>
    );
  }

  async function calculateRoute() {
    if (originRef.current && destinationRef.current) {
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        return;
      }

      const directionsService = new window.google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: window.google.maps.TravelMode.DRIVING,
      });

      if (results.routes && results.routes.length > 0) {
        const route = results.routes[0];
        if (route.legs && route.legs.length > 0) {
          const leg = route.legs[0];
          if (leg.distance && leg.duration) {
            setDirectionsResponse(results);
            setDistance(leg.distance.text);
            setDuration(leg.duration.text);
          }
        }
      }

      // Clear input values after calculating the route
      if (originRef.current) {
        originRef.current.value = "";
      }
      if (destinationRef.current) {
        destinationRef.current.value = "";
      }
    }
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");

    if (originRef.current) {
      originRef.current.value = "";
    }
    if (destinationRef.current) {
      destinationRef.current.value = "";
    }
  }

  const blueMarkerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    fillColor: "green",
    fillOpacity: 1,
    strokeColor: "black",
    strokeOpacity: 1,
    strokeWeight: 1,
    scale: 8,
  };

  // kyc approval

  const handleApprovekyc = async () => {
    setIsLoading(true);
    try {
      const userString = localStorage.getItem("user");
  
      if (!userString) {
        throw new Error("User token not found");
      }
  
      const user = JSON.parse(userString);
  
      if (!user || !user.token || !user.userId) {
        throw new Error("Invalid user data");
      }
  
      const body = JSON.stringify({
        status: "Approved", // Use the correct status for approval
      });
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kyc/update-status/${kycId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
            cache: "no-store" ,
          },
          body: body,
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(`Failed to approve KYC: ${response}`);
      }
    } catch (error) {
      console.error("Error during KYC approval:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDisapprovekyc = async () => {
    setIsLoading(true);
    try {
      const userString = localStorage.getItem("user");
  
      if (!userString) {
        throw new Error("User token not found");
      }
  
      const user = JSON.parse(userString);
  
      if (!user || !user.token || !user.userId) {
        throw new Error("Invalid user data");
      }
  
      const body = JSON.stringify({
        status: "Rejected", // Use the correct status for approval
      });
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/kyc/update-status/${kycId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json", // Specify JSON content type
            cache: "no-store",
          },
          body: body,
        }
      );
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(`Failed to approve KYC: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error during KYC approval:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  




  // const handleDisapprovekyc = async (status, CustomerID) => {
  //   setIsLoading(true);
  //   try {
  //     const token = localStorage.getItem("token"); // Replace with your authentication method
  //     const headers = {
  //       Authorization: `Bearer ${token}`,
  //       "Content-Type": "multipart/form-data",
  //     };

  //     const body = {
  //       userid: CustomerID, // Use the itemId parameter here
  //       action: status, // Use the status parameter here
  //     };

  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/User/kyc.php`,

  //       body,
  //       { headers, cache: "no-store" }
  //     );

  //     // Handle the response as needed
  //     // console.log(response.data);
  //     if (response.status === 200) {
  //       // Handle a successful response here
  //       toast.error("User KYC has been Disapproved successfully", {
  //         position: "top-right",
  //         autoClose: 1500,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 3000);
  //       setIsLoading(false);
  //     } else if (response.status === 401) {
  //       // Handle unauthorized access
  //     } else {
  //       // Handle other status codes or errors
  //     }
  //   } catch (error) {
  //     setError("An error occurred while updating the order status.");

  //     toast.error(error, {
  //       position: "top-right",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //     setIsLoading(false);
  //   }
  // };

  // end of kyc

  //  subscriptions
  const handleApproveStatus = async (status, subscription_id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Replace with your authentication method
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const body = {
        subscription_id: subscription_id, // Use the itemId parameter here
        status: status, // Use the status parameter here
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,

        body,
        { headers, cache: "no-store" }
      );

      // Handle the response as needed
      // console.log(response.data);
      if (response.status === 200) {
        // Handle a successful response here
        toast.success("subscription marked as Approved", {
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
          window.location.reload();
        }, 3000);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
      } else {
        // Handle other status codes or errors
      }
    } catch (error) {
      setError("An error occurred while updating the order status.");

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
      const token = localStorage.getItem("token"); // Replace with your authentication method
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const body = {
        subscription_id: subscription_id, // Use the itemId parameter here
        status: status, // Use the status parameter here
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,
        body,
        { headers, cache: "no-store" }
      );

      // Handle the response as needed
      // console.log(response.data);

      if (response.status === 200) {
        // Handle a successful response here
        toast.info("subscription marked as Pending", {
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
          window.location.reload();
        }, 3000);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
      } else {
        // Handle other status codes or errors
      }
    } catch (error) {
      setError("An error occurred while updating the order status.");

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
      const token = localStorage.getItem("token"); // Replace with your authentication method
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const body = {
        subscription_id: subscription_id, // Use the itemId parameter here
        status: status, // Use the status parameter here
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,

        body,
        { headers, cache: "no-store" }
      );

      // Handle the response as needed
      // console.log(response.data);
      if (response.status === 200) {
        // Handle a successful response here
        toast.warning("subscription has been Queried", {
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
          window.location.reload();
        }, 3000);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
      } else {
        // Handle other status codes or errors
      }
    } catch (error) {
      setError("An error occurred while updating the order status.");

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
      const token = localStorage.getItem("token"); // Replace with your authentication method
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const body = {
        subscription_id: subscription_id, // Use the itemId parameter here
        status: status, // Use the status parameter here
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/User/UpdateSubscription.php`,

        body,
        { headers, cache: "no-store" }
      );

      // Handle the response as needed
      // console.log(response.data);
      if (response.status === 200) {
        // Handle a successful response here
        toast.error("subscription has been Denied", {
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
          window.location.reload();
        }, 3000);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
      } else {
        // Handle other status codes or errors
      }
    } catch (error) {
      setError("An error occurred while updating the order status.");

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
  // end of subscription

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
                return naira.format(wallet);
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
        <Chart
          series={series}
          options={options}
          type="radialBar"
          height="210"
        />
      </div>
    );
  };

  // const files = [
  //   {
  //     img: "/assets/images/icon/pdf-1.svg",
  //     title: "Account Statement.pdf",
  //     date: formattedDate(created_at),
  //     link: bank_statement,
  //   },
  //   {
  //     img: "/assets/images/icon/pdf-2.svg",
  //     title: "Remita Mandate Form.pdf",
  //     date: formattedDate(created_at),
  //     link: remita,
  //   },

  //   {
  //     img: "/assets/images/icon/scr-1.svg",
  //     title: "Proof of Identity.jpg",
  //     date: formattedDate(created_at),
  //     link: proof_id,
  //   },

  //   // {
  //   //   img: "/assets/images/icon/pdf-2.svg",
  //   //   title: "Proof of Identity.pdf",
  //   //   date: (formattedDate(created_at)),
  //   //   link:"go",
  //   // },
  // ];
  // background changes

  return (
    <>
      <ToastContainer />

      <Modal
        activeModal={profileModal}
        onClose={() => setProfileModal(false)}
        title={isLoading ? "Updating..." : "Update Profile "}
        className="max-w-[48%]"
        footerContent={
          <div className="flex ltr:text-right rtl:text-left space-x-1">
            <Button
              className="btn btn-dark   text-center"
              onClick={UpdateProfile}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Update Profile"
              )}
            </Button>
          </div>
        }
      >
        <div className="text-base text-slate-600 dark:text-slate-300">
          <Card title="Update Profile Details">
            <form>
              <div className="space-y-3">
                <Textinput
                  label="Username"
                  id="username"
                  name="username"
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => {
                    setIsusername(e.target.value);
                  }}
                  defaultValue={isusername}
                />
                <Textinput
                  label="First Name*"
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => {
                    setIsfirstname(e.target.value);
                  }}
                  defaultValue={isfirstname}
                />
                <Textinput
                  label="Last Name*"
                  placeholder="Last Name"
                  type="text"
                  id="last_name"
                  name="last_name"
                  onChange={(e) => {
                    setIslastname(e.target.value);
                  }}
                  defaultValue={islastname}
                />
                <Textinput
                  label="Phone Number"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="8122233345"
                  onChange={(e) => {
                    setIsphone(e.target.value);
                  }}
                  defaultValue={isphone}
                />
                <Textinput
                  label="Email Address "
                  placeholder="Email Address *"
                  type="email"
                  id="email"
                  name="email"
                  onChange={(e) => {
                    setIsemail(e.target.value);
                  }}
                  defaultValue={isemail}
                
                />
                <Textinput
                  label="Password "
                  placeholder="Password *"
                  type="password"
                  id="password"
                  name="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  defaultValue={password}
                  readonly
                />

                <label className="relative mt-4 inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value={isBusinessDefault}
                    className="sr-only peer"
                    checked={isChecked}
                    onChange={handleToggleChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-800"></div>
                  <span className="ms-3 ml-4 text-sm font-medium text-success-900 dark:text-success-900">
                    Mark as Business Account
                  </span>
                </label>
              </div>
            </form>
            <br />
            {error ? (
              <Alert
                label={error}
                className="alert-danger light-mode w-full "
              />
            ) : (
              ""
            )}

            {success ? (
              <Alert
                label={success}
                className="alert-success light-mode w-full "
              />
            ) : (
              ""
            )}
          </Card>
        </div>
      </Modal>

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
        }
      >
        <div>
          <div className="flex justify-between mt-[40px]">
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold">
                Transaction ID
              </h2>
              <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                {selectedHistory?.id}
              </p>
            </div>
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold text-right">
                Transaction Date
              </h2>
              <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                {(() => {
                  const rawDate = selectedHistory?.date;
                  const date = new Date(rawDate);
                  return !isNaN(date.getTime()) ? (
                    <>
                      {new Intl.DateTimeFormat("en", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
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
              <h2 className="text-[20px] leading-[25px] font-bold">
                Payment Mode
              </h2>
              <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                {selectedHistory?.paymentMode}
              </p>
            </div>
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold text-right">
                Amount
              </h2>
              <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                {naira.format(selectedHistory?.amount)}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-[30px]">
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold">
                Description
              </h2>
              <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                {selectedHistory?.description}
              </p>
            </div>
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold text-right">
                Transaction Type
              </h2>
              <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                {selectedHistory?.type}
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-[30px] items-center">
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold">
                Transaction Status
              </h2>
              <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                {selectedHistory?.status}
              </p>
            </div>
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold text-right">
                User ID
              </h2>
              <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                {selectedHistory?.user}
              </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title="Shipping Information"
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
              <div className="border-2 p-5 mt-3 border-[#000000] relative h-96">
                <br />

                <div className="absolute inset-0">
                  {/* Google Map Box */}
                  <GoogleMap
                    center={mapCenter}
                    zoom={15}
                    mapContainerStyle={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    options={{
                      zoomControl: false,
                      streetViewControl: false,
                      mapTypeControl: true,
                      fullscreenControl: true,
                    }}
                    onLoad={(map) => setMap(map)}
                  >
                    <Marker position={mapCenter} icon={blueMarkerIcon} />
                    <Circle center={mapCenter} radius={circleRadius} />
                    {directionsResponse && (
                      <DirectionsRenderer directions={directionsResponse} />
                    )}
                  </GoogleMap>
                </div>
              </div>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Shipping Address</b> {landmark}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>House Number :</b> {houseNumber + " " + streetAddress}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>State :</b> {town + " " + shippingState}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Contact Number :</b>
                {contactPhone}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Latitude :</b>
                {latitude}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Longitude:</b>
                {longitude}
              </h2>
            </div>
            <div className="text-4xl text-blue-400">
              {/* <Icon icon="heroicons:pencil-square" className="text-[#1c404d] w-7 h-8 cursor-pointer"  onClick={handlePrint} />
               */}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        className="w-[60%]"
        activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title={selectedOrder?.id}
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
          <Card>
            <div>
              <div className="flex z-[5] items-center relative justify-center md:mx-8">
                {steps.map((item, i) => (
                  <div
                    className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none group"
                    key={i}
                  >
                    <div
                      className={`${
                        statusIndex >= i
                          ? "bg-slate-900 text-white ring-slate-900 ring-offset-2 dark:ring-offset-slate-500 dark:bg-slate-900 dark:ring-slate-900"
                          : "bg-white ring-slate-900 ring-opacity-70  text-slate-900 dark:text-slate-300 dark:bg-slate-600 dark:ring-slate-600 text-opacity-70"
                      }  transition duration-150 icon-box md:h-12 md:w-12 h-7 w-7 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium`}
                    >
                      {statusIndex <= i ? (
                        i === 0 ? (
                          <Icon icon="ic:twotone-pending-actions" /> // Replace with your first icon
                        ) : i === 1 ? (
                          <Icon icon="flat-color-icons:paid" /> // Replace with your third icon
                        ) : i === 2 ? (
                          <Icon icon="uis:process" /> // Replace with your second icon
                        ) : i === 3 ? (
                          <Icon icon="wpf:in-transit" /> // Replace with your third icon
                        ) : i === 4 ? (
                          <Icon icon="solar:delivery-bold" /> // Replace with your third icon
                        ) : i === 5 ? (
                          <Icon icon="fluent-mdl2:completed-solid" /> // Replace with your third icon
                        ) : (
                          <span>{i + 1}</span>
                        )
                      ) : (
                        <span className="text-3xl">
                          <Icon icon="bx:check-double" />
                        </span>
                      )}
                    </div>

                    <div
                      className={`${
                        statusIndex >= i
                          ? "bg-slate-900 dark:bg-slate-900"
                          : "bg-[#E0EAFF] dark:bg-slate-700"
                      } absolute top-1/2 h-[2px] w-full`}
                    ></div>
                    <div
                      className={` ${
                        statusIndex >= i
                          ? " text-slate-900 dark:text-slate-300"
                          : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                      } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100`}
                    >
                      <span className="w-max">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <br />

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
                      Customer Username
                    </th>
                    <th scope="col" className="table-th">
                      Mobile Number
                    </th>
                    <th scope="col" className="table-th">
                      Location
                    </th>
                    <th scope="col" className="table-th">
                      Price
                    </th>
                    <th scope="col" className="table-th">
                      Payment Channel
                    </th>

                    <th scope="col" className="table-th">
                      City
                    </th>

                    <th scope="col" className="table-th">
                      Status
                    </th>
                    <th scope="col" className="table-th">
                      Date
                    </th>
                    <th scope="col" className="table-th">
                      Est-Delivery
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  <tr>
                    <td className="table-td py-2">
                      <span>
                        {selectedOrder?.id.slice(0, 8)}...
                        {selectedOrder?.id.slice(-10)}
                      </span>
                    </td>
                    <td className="table-td py-2">
                      {selectedOrder?.user?.username}
                    </td>
                    <td className="table-td py-2">
                      {"+234" + "" + selectedOrder?.phone}
                    </td>
                    <td className="table-td py-2 ">
                      {selectedOrder?.trackingId?.location || "No Location"}
                    </td>
                    <td className="table-td py-2">
                      {naira.format(selectedOrder?.totalPrice || "0")}
                    </td>
                    <td className="table-td py-2">
                      {selectedOrder?.transaction?.paymentMode ||
                        "Unknown Payment Mode"}
                    </td>
                    <td className="table-td py-2"> {selectedOrder?.city} </td>
                    <td className="table-td py-2">
                      <span className="block w-full">
                        <span
                          className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                            selectedOrder?.trackingId?.status === "Delivered"
                              ? "text-success-500 bg-success-500"
                              : ""
                          } 
            ${
              selectedOrder?.trackingId?.status === "Closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              selectedOrder?.trackingId?.status === "Paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              selectedOrder?.trackingId?.status === "Processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              selectedOrder?.trackingId?.status === "Closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  selectedOrder?.trackingId?.status === "Pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                            selectedOrder?.trackingId?.status === "In-transit"
                              ? "text-primary-500 bg-primary-500"
                              : ""
                          }
            
             `}
                        >
                          {selectedOrder?.trackingId?.status}
                        </span>
                      </span>
                    </td>
                    <td className="table-td py-2">
                      {formattedDate(selectedOrder?.dateOrdered)}
                    </td>
                    <td className="table-td py-2">
                      {formattedDate(
                        selectedOrder?.trackingId?.estimatedDelivery
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <br />

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
                      Image
                    </th>
                    <th scope="col" className="table-th">
                      Product Name
                    </th>
                    <th scope="col" className="table-th">
                      Description
                    </th>
                    <th scope="col" className="table-th">
                      Price
                    </th>
                    <th scope="col" className="table-th">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {selectedOrder?.orderItems?.map((item) => (
                    <tr key={item.id}>
                      <td className="table-td py-2">
                        {" "}
                        {item.product?.id.slice(0, 8)}...
                        {item.product?.id.slice(-10)}
                      </td>

                      <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                        <img
                          className="w-20 h-20 rounded"
                          src={
                            item.product?.image === null
                              ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                              : item.product?.image
                          }
                          width={70}
                          height={70}
                          alt={item.product?.name}
                        />
                      </td>
                      <td className="table-td py-2">{item.product?.name}</td>
                      <td className="table-td py-2">
                        {item.product?.description
                          ? HTMLReactParser(item.product.description)
                          : null}
                      </td>
                      <td className="table-td py-2">{item.product?.price}</td>
                      <td className="table-td py-2">{item?.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <br />
        <div className="w-full px-2 ml-auto">
          <div className="bg-[#ffffe6] rounded-lg shadow-[0px_0px_2px_#0000004D] px-4 py-4 flex items-start justify-start">
            <div className="flex-1">
              <p className="text-[32px] font-bold leading-[40px] mt-[5px] text-[#585820]">
                Shipping Information
              </p>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Logistics : </b> {selectedOrder?.logistics}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Email Address : </b> {selectedOrder?.user.email}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Shipping Address 1 :</b>{" "}
                {selectedOrder?.shippingAddress1 || "No Location"}
              </h2>
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Shipping Address 2 :</b>{" "}
                {selectedOrder?.shippingAddress2 || "No Location"}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Location :</b>
                {selectedOrder?.trackingId?.location || "No Location"}
              </h2>
              <br />
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Contact Number :</b>
                {"+234" + "" + selectedOrder?.phone}
              </h2>
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>City :</b> {selectedOrder?.city}
              </h2>
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>State :</b> {selectedOrder?.country}
              </h2>
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Country :</b> {selectedOrder?.country}
              </h2>
              <h2 className="text-[16px] leading-[20.16px] font-medium text-[#585820]">
                <b>Zip :</b> {selectedOrder?.zip}
              </h2>
              <br />
            </div>
            <div className="text-4xl text-blue-400">
              <Icon
                icon="heroicons:pencil-square"
                className="text-[#1c404d] w-7 h-8 cursor-pointer"
                onClick={handlePrint}
              />
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        activeModal={delete_orderModal}
        onClose={() => setDelete_orderModal(false)}
        centered
        title={selectedOrder?.id}
        footer={
          <Button
            text="Close"
            btnClass="btn-danger"
            onClick={() => setDelete_orderModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          <center>
            <img
              src={
                "https://p.turbosquid.com/ts-thumb/Kc/2Qw5vF/rQ/searchimagetransparentalternative_whitebg/png/1680707751/300x300/sharp_fit_q85/cdff1a28155c195262452dd977d32caa67becfc8/searchimagetransparentalternative_whitebg.jpg"
              }
              alt="order"
              className="w-[150px] h-[150px] rounded-md "
            />

            <div className="text-slate-600 dark:text-slate-200 text-lg pt-4 pb-1">
              <p className="font-bold">
                Are you sure you want to delete this Oder ?
              </p>
            </div>
            <div className="text-slate-600 dark:text-slate-200 text-lg rounded-lg pb-1">
              {selectedOrder?.id}
            </div>
            <div className="text-slate-600 dark:text-slate-200 text-lg pb-1">
              {naira.format(selectedOrder?.totalPrice)}
            </div>
            <div className="text-slate-600 dark:text-slate-200 text-lg pb-1">
              {"+234" + "" + selectedOrder?.phone}
            </div>
            {error ? (
              <Alert label={error} className="alert-danger light-mode w-fit " />
            ) : (
              ""
            )}

            {success ? (
              <Alert
                label={success}
                className="alert-success light-mode w-full"
              />
            ) : (
              ""
            )}
            <br />

            <div className="flex ltr:text-right rtl:text-left space-x-2 justify-center">
              <Button
                className="btn btn-dark  text-center"
                onClick={() => setDelete_orderModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="btn btn-danger  text-center"
                onClick={handleDeleteOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Delete Order"
                )}
              </Button>
            </div>
          </center>
        </form>
      </Modal>

      <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-[#000000] lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
        <div
          className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg"
          style={{
            backgroundImage: `url(${backgrounds[currentBackground]})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse absolute right-3 top-3">
            <Link href={`tel:${phone}`}>
              <div className="msg-action-btn">
                <Icon icon="heroicons-outline:phone" />
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

            <div
              className="msg-action-btn"
              onClick={() => {
                setActiveModal(true);
              }}
            >
              <Icon icon="la:shipping-fast" />
            </div>
          </div>
        </div>

        <div className="profile-box flex-none md:text-start text-center">
          <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
            <div className="flex-none">
              <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                <img
                  src={
                    avatar == "" ? "/assets/images/users/user-1.jpg" : avatar
                  }
                  className="w-full h-full object-cover rounded-full"
                />
                <div
                  className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  onClick={() => {
                    setProfileModal(true);
                  }}
                >
                  <Icon icon="heroicons:pencil-square" />
                </div>

               
              
              </div>
            </div>

            <div className="flex-1">
              <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                {`${firstname} ${lastname}`.toUpperCase()} 
                &nbsp;
                {isVerified == true ? (
                <div className=" text-success-500 bg-success-500 px-3 inline-block  min-w-[60px] text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                Verified
                </div>
              ) : (
                <div className=" text-danger-500 bg-danger-500 px-3 inline-block  min-w-[60px]  text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                  Not Verified
                </div>
              )}
                <br />
              </div>

              <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                {isBusiness == true ? (
                  <div className="inline-block bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
                    Business Account
                  </div>
                ) : (
                  <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
                    Customer Account
                  </div>
                )}

                <div className="flex-1">
           
          </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
          <div className="flex-1">
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              <center>{account_number}</center>
            </div>
            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Account Number
            </div>
            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              {accountName}
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
              {kycStatus === "Approved" ? (
                <div className=" text-success-500 bg-success-500 px-3 inline-block  min-w-[60px] text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                  Approved
                </div>
              ) : (
                <div className=" text-danger-500 bg-danger-500 px-3 inline-block  min-w-[60px]  text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                Rejected
                </div>
              )}
            </div>

            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Kyc Status
            </div>
          </div>
          {/* <div className="flex-1">
            <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1 pr-3">
              {isVerified == true ? (
                <div className=" text-success-500 bg-success-500 px-3 inline-block  min-w-[60px] text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                  Approve
                </div>
              ) : (
                <div className=" text-danger-500 bg-danger-500 px-3 inline-block  min-w-[60px]  text-xs font-medium text-center mx-auto py-1 rounded-[999px] bg-opacity-25">
                  Pending
                </div>
              )}
            </div>

            <div className="text-sm text-slate-600 font-light dark:text-slate-300">
              Kyc Status
            </div>
          </div> */}
          <div className="flex-1">
            <>
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                <div className="inline-block  text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
                  {formattedDate(isCreated)}
                </div>
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Date Created
              </div>
            </>
          </div>
        </div>
      </div>
      <br />
      <center>
        <Button
          icon="mdi:approve"
          text="Approve Business"
          className="btn-outline-success "
          onClick={() => handleApprovekyc()}
          disabled={isLoading}
        />
        &nbsp;&nbsp;&nbsp;
        <Button
          icon="subway:error"
          text="Disapprove Business"
          className="btn-outline-danger "
          onClick={() => handleDisapprovekyc()}
          disabled={isLoading}
        />
      </center>
      <br />
      <div className="grid grid-cols-12 gap-6">
        <div className="lg:col-span-4 col-span-12">
          <Card title="Info">
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
                    href={`mailto:${email}`}
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
                    ADDRESS
                  </div>
                  <div className="text-base text-slate-600 dark:text-slate-50">
                    {street}
                  </div>
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
                    {city + "," + state + "," + nationality}
                  </div>
                </div>
              </li>
            </ul>
          </Card>
        </div>

        <div className="xl:col-span-4 lg:col-span-5 col-span-12 ">
          <Card title="Files" className="h-[394px]">
            {step === 200 ? (
              <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                {images.map((item, i) => (
                  <li key={i} className="block py-[8px]">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                        <div className="flex-none">
                          <div className="h-8 w-8">
                            <img
                              src={"/assets/images/icon/scr-1.svg"}
                              alt=""
                              className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <span className="block text-slate-600 text-sm dark:text-slate-300">
                            {"Files"}
                          </span>
                          <span className="block font-normal text-xs text-slate-500 mt-1">
                            {formattedDate(isCreated)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-none">
                        <Link
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button
                            type="button"
                            className="text-xs text-slate-900 dark:text-white"
                          >
                            View
                          </button>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span>No Kyc Information yet</span>
            )}
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12">
          <Card title="Account Overview">
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
                <div className="text-sm font-medium text-slate-900 dark:text-white justify-center items-center ">
                  {naira.format(outstanding)}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-slate-600 dark:text-slate-200 text-xs font-normal">
                  Spending Limit
                </h4>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {naira.format(spending_limit)}
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-12 space-y-5">
          <div className="lg:col-span-4 col-span-12 space-y-5">
            <Card title="Kyc information">
              {step === 200 ? (
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Update KYC</span>
                      <span
                        onClick={() => {
                          setProfileModal(true);
                        }}
                      >
                        {" "}
                        <Icon icon="heroicons:pencil-square" />
                      </span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Name</span>
                      <span>Details</span>
                    </div>
                  </li>

                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>BVN</span>
                      <span>{bvn}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Date of Birth</span>
                      <span>{formattedDate(dob)}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Marital Status</span>
                      <span>{marital}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Maidens Name</span>
                      <span>{maiden}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Family Number</span>
                      <span>{num}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Gender</span>
                      <span>{gender}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Proof of Identity</span>
                      <span>{proof}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Identity Number</span>
                      <span>{idNumber}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Issue Date</span>
                      <span>{formattedDate(issueDate)}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Expiry Date</span>
                      <span>{formattedDate(expiryDate)}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Rc Number</span>
                      <span>{rcNumber}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Referral Code</span>
                      <span>{referralcode}</span>
                    </div>
                  </li>
                  <li className="first:text-xs text-sm first:text-slate-600 text-slate-600 dark:text-slate-300 py-2 first:uppercase">
                    <div className="flex justify-between">
                      <span>Referred By</span>
                      <span>{refby}</span>
                    </div>
                  </li>
                </ul>
              ) : (
                <span>No Kyc Information yet</span>
              )}
            </Card>
          </div>
        </div>
        <div className="lg:col-span-8 col-span-12">
          <Card title="User Overview">
            <BasicArea height={417} />
          </Card>
        </div>
        <div className="lg:col-span-full col-span-12">
          <Card title={firstname + "  " + "Activities"}>
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
                          <GlobalFilter
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                          />
                        </div>
                      </div>

                      <div className="-mx-6 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden ">
                            {isHistoryEmpty ? ( // Conditionally rendering based on cart items
                              <center>
                                <h4 className="mt-10 text-2xl font-bold text-primary">
                                  No Available Transaction History Data
                                </h4>
                              </center>
                            ) : (
                              <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                                <thead className="bg-slate-200 dark:bg-slate-700">
                                  <tr>
                                    <th scope="col" className="table-th">
                                      ID
                                    </th>
                                    <th scope="col" className="table-th">
                                      Amount
                                    </th>
                                    <th scope="col" className="table-th">
                                      Payment Mode
                                    </th>
                                    <th scope="col" className="table-th">
                                      Description
                                    </th>
                                    <th scope="col" className="table-th">
                                      Type
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
                                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                      <tr>
                                        <td className="table-td">
                                          <span>
                                            {item.id.slice(0, 8)}...
                                            {item.id.slice(-10)}
                                          </span>
                                        </td>
                                        <td className="table-td">
                                          {naira.format(item.amount)}
                                        </td>
                                        <td className="table-td">
                                          {item.paymentMode}
                                        </td>
                                        <td className="table-td">
                                          <span className="text-slate-500 dark:text-slate-400">
                                            <span className="block text-slate-600 dark:text-slate-300">
                                              {item.description}
                                            </span>
                                          </span>
                                        </td>
                                        <td className="table-td">
                                          <span className="text-slate-500 dark:text-slate-400">
                                            <span className="block text-xs text-slate-500">
                                              {item.type}
                                            </span>
                                          </span>
                                        </td>
                                        <td className="table-td">
                                          <span className="block w-full">
                                            <span
                                              className={`${
                                                item.status === "Completed"
                                                  ? "text-success-500 "
                                                  : ""
                                              } 
                  ${item.status === "Pending" ? "text-warning-500 " : ""}
                  ${item.status === "Canceled" ? "text-danger-500" : ""}
                  
                   `}
                                            >
                                              {item.status}
                                            </span>
                                          </span>
                                        </td>
                                        <td className="table-td">
                                          {formattedDate(item.date)}
                                        </td>
                                        <td className="table-td">
                                          <div className="flex space-x-3 rtl:space-x-reverse">
                                            <Tooltip
                                              content="View"
                                              placement="top"
                                              arrow
                                              animation="shift-away"
                                            >
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
                              <option
                                key={pageSizeOption}
                                value={pageSizeOption}
                              >
                                Show {pageSizeOption}
                              </option>
                            ))}
                          </select>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Page
                            <span>
                              {currentPage} of {totalPages}
                            </span>
                          </span>
                        </div>
                        <ul className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse">
                          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                            <button
                              className={`${
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                        <h4 className="card-title">{title}</h4>
                        <div>
                          <GlobalFilter
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                          />
                        </div>
                      </div>
                      <div className="-mx-6 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden ">
                            {isLoanEmpty ? ( // Conditionally rendering based on cart items
                              <center>
                                <h4 className="mt-10 text-2xl font-bold text-primary">
                                  No Available Loan
                                </h4>
                              </center>
                            ) : (
                              <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                                <thead className="bg-slate-200 dark:bg-slate-700">
                                  <tr>
                                    <th scope="col" className="table-th">
                                      ID
                                    </th>
                                    <th scope="col" className="table-th">
                                      Amount
                                    </th>
                                    <th scope="col" className="table-th">
                                      Interest Rate
                                    </th>
                                    <th scope="col" className="table-th">
                                      Overdue
                                    </th>
                                    <th scope="col" className="table-th">
                                      Loan Limit
                                    </th>
                                    <th scope="col" className="table-th">
                                      Outstanding
                                    </th>
                                    <th scope="col" className="table-th">
                                      Total Loan
                                    </th>
                                    <th scope="col" className="table-th">
                                      Status
                                    </th>
                                    <th scope="col" className="table-th">
                                      Due Date
                                    </th>
                                  </tr>
                                </thead>
                                {paginatedLoan.map((item) => (
                                  <React.Fragment key={item?.id}>
                                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                      <tr>
                                        <td className="table-td py-2">
                                          <span>
                                            {" "}
                                            {item?.id.slice(0, 5)}...
                                            {item.id.slice(-10)}
                                          </span>
                                        </td>
                                        <td className="table-td py-2 ">
                                          {" "}
                                          {naira.format(
                                            item?.amount || "0"
                                          )}{" "}
                                        </td>
                                        <td className="table-td py-2">
                                          {item?.interestRate}
                                        </td>
                                        <td className="table-td py-2">
                                          <span className="block w-full">
                                            {item?.isOverdue}
                                          </span>

                                          {item.isOverdue === true ? (
                                            <span className="block w-full">
                                              <p
                                                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                                  item?.isOverdue === true
                                                    ? "text-danger-500 bg-danger-500"
                                                    : ""
                                                }`}
                                              >
                                                Yes
                                              </p>
                                            </span>
                                          ) : (
                                            <span className="block w-full">
                                              <p
                                                className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 
          
            ${
              item?.isOverdue === false ? "text-success-500 bg-success-500" : ""
            }
                
             `}
                                              >
                                                No
                                              </p>
                                            </span>
                                          )}
                                        </td>
                                        <td className="table-td py-2">
                                          {item?.limit}
                                        </td>
                                        <td className="table-td py-2">
                                          {item?.outstanding}
                                        </td>
                                        <td className="table-td py-2">
                                          {item?.totalLoan}
                                        </td>
                                        <td className="table-td py-2">
                                          <span className="block w-full">
                                            <span
                                              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                                item?.status === "Active"
                                                  ? "text-success-500 bg-success-500"
                                                  : ""
                                              } 
          
            ${item?.status === "denied" ? "text-danger-500 bg-danger-500" : ""}
                
             `}
                                            >
                                              {item?.status}
                                            </span>
                                          </span>
                                        </td>
                                        <td className="table-td py-2">
                                          {formattedDate(item?.dueDate)}
                                        </td>
                                        {/* <td className="table-td py-2">
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
                                                  onClick={() =>
                                                    handleApproveStatus(
                                                      "approve",
                                                      item.sub_info.id
                                                    )
                                                  }
                                                  disabled={isLoading}
                                                >
                                                  <div className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse">
                                                    <span className="text-base">
                                                      <Icon icon="mdi:approve" />
                                                    </span>
                                                    <span>
                                                      {" "}
                                                      {isLoading
                                                        ? "Updating..."
                                                        : "Approve"}
                                                    </span>
                                                  </div>
                                                </Menu.Item>

                                                <Menu.Item
                                                  onClick={() =>
                                                    handlePendingStatus(
                                                      "pending",
                                                      item.sub_info.id
                                                    )
                                                  }
                                                  disabled={isLoading}
                                                >
                                                  <div className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse">
                                                    <span className="text-base">
                                                      <Icon icon="material-symbols:pending-actions-rounded" />
                                                    </span>
                                                    <span>
                                                      {" "}
                                                      {isLoading
                                                        ? "Updating..."
                                                        : "Pend"}
                                                    </span>
                                                  </div>
                                                </Menu.Item>
                                                <Menu.Item
                                                  onClick={() =>
                                                    handleQueryStatus(
                                                      "queried",
                                                      item.sub_info.id
                                                    )
                                                  }
                                                  disabled={isLoading}
                                                >
                                                  <div className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse">
                                                    <span className="text-base">
                                                      <Icon icon="streamline:interface-help-question-square-frame-help-mark-query-question-square" />
                                                    </span>
                                                    <span>
                                                      {" "}
                                                      {isLoading
                                                        ? "Updating..."
                                                        : "Query"}
                                                    </span>
                                                  </div>
                                                </Menu.Item>

                                                <Menu.Item
                                                  onClick={() =>
                                                    handleDenyStatus(
                                                      "denied",
                                                      item.sub_info.id
                                                    )
                                                  }
                                                  disabled={isLoading}
                                                >
                                                  <div
                                                    className="bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse "
                                                  >
                                                    <span className="text-base">
                                                      <Icon icon="fluent:shifts-deny-24-regular" />
                                                    </span>
                                                    <span>
                                                      {" "}
                                                      {isLoading
                                                        ? "Updating..."
                                                        : "Deny"}
                                                    </span>
                                                  </div>
                                                </Menu.Item>
                                              </div>
                                            </Dropdown>
                                          </div>
                                        </td> */}
                                      </tr>
                                    </tbody>
                                  </React.Fragment>
                                ))}
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
                                <br />
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
                              <option
                                key={pageSizeOption}
                                value={pageSizeOption}
                              >
                                Show {pageSizeOption}
                              </option>
                            ))}
                          </select>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Page
                            <span>
                              {currentPage} of {totalPages}
                            </span>
                          </span>
                        </div>
                        <ul className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse">
                          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                            <button
                              className={`${
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                        <h4 className="card-title">
                          {firstname + " " + " Orders"}
                        </h4>
                        <div>
                          <GlobalFilter
                            filter={globalFilter}
                            setFilter={setGlobalFilter}
                          />
                        </div>
                      </div>
                      <div className="-mx-6 overflow-x-auto">
                        <div className="inline-block min-w-full align-middle">
                          <div className="overflow-hidden ">
                            {isOrderEmpty ? ( // Conditionally rendering based on cart items
                              <center>
                                <h4 className="mt-10 text-2xl font-bold text-primary">
                                  No Available Order Items Data
                                </h4>
                              </center>
                            ) : (
                              <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                                <thead className="bg-slate-200 dark:bg-slate-700">
                                  <tr>
                                    <th scope="col" className="table-th">
                                      ID
                                    </th>
                                    <th scope="col" className="table-th">
                                      Customer Username
                                    </th>
                                    <th scope="col" className="table-th">
                                      Mobile Number
                                    </th>
                                    <th scope="col" className="table-th">
                                      Location
                                    </th>
                                    <th scope="col" className="table-th">
                                      Price
                                    </th>
                                    <th scope="col" className="table-th">
                                      Payment Channel
                                    </th>

                                    <th scope="col" className="table-th">
                                      City
                                    </th>

                                    <th scope="col" className="table-th">
                                      Status
                                    </th>
                                    <th scope="col" className="table-th">
                                      Date
                                    </th>
                                    <th scope="col" className="table-th">
                                      Est-Delivery
                                    </th>

                                    <th scope="col" className="table-th">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                {paginatedOrder.map((item) => (
                                  <React.Fragment key={item?.id}>
                                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                      <tr>
                                        <td className="table-td py-2">
                                          {" "}
                                          <span>
                                            {item.id.slice(0, 8)}...
                                            {item.id.slice(-10)}
                                          </span>
                                        </td>
                                        <td className="table-td py-2 ">
                                          {" "}
                                          {item.user?.username}{" "}
                                        </td>
                                        <td className="table-td py-2 ">
                                          {" "}
                                          {"+234" + "" + item?.phone}{" "}
                                        </td>

                                        <td className="table-td py-2 ">
                                          {item.trackingId?.location ||
                                            "No Location"}
                                        </td>
                                        <td className="table-td py-2">
                                          {" "}
                                          {naira.format(
                                            item?.totalPrice || "0"
                                          )}
                                        </td>
                                        <td className="table-td py-2">
                                          {" "}
                                          {item.transaction?.paymentMode}{" "}
                                        </td>

                                        <td className="table-td py-2">
                                          {" "}
                                          {item?.city}{" "}
                                        </td>
                                        <td className="table-td py-2">
                                          <span className="block w-full">
                                            <span
                                              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                                item.trackingId?.status ===
                                                "Delivered"
                                                  ? "text-success-500 bg-success-500"
                                                  : ""
                                              } 
            ${
              item.trackingId?.status === "Closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              item.trackingId?.status === "Paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              item.trackingId?.status === "Processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              item.trackingId?.status === "Closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  item.trackingId?.status === "Pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                                                item.trackingId?.status ===
                                                "In-transit"
                                                  ? "text-primary-500 bg-primary-500"
                                                  : ""
                                              }
            
             `}
                                            >
                                              {item.trackingId?.status}
                                            </span>
                                          </span>
                                        </td>

                                        <td className="table-td py-2">
                                          {formattedDate(item?.dateOrdered)}
                                        </td>
                                        <td className="table-td py-2">
                                          {" "}
                                          {formattedDate(
                                            item.trackingId?.estimatedDelivery
                                          )}{" "}
                                        </td>

                                        <td className="table-td py-2">
                                          {" "}
                                          <div className="flex space-x-3 rtl:space-x-reverse">
                                            <Tooltip
                                              content="View"
                                              placement="top"
                                              arrow
                                              animation="shift-away"
                                            >
                                              <button
                                                className="action-btn"
                                                type="button"
                                                onClick={() => {
                                                  setSelectedOrder(item);
                                                  setActiveModal(true);
                                                }}
                                              >
                                                <Icon icon="heroicons:eye" />
                                              </button>
                                            </Tooltip>

                                           <Tooltip
                              content="Edit"
                              placement="top"
                              arrow
                              animation="shift-away"
                            >
                              <button
                                className="action-btn"
                              
                                onClick={() => handleClick(item)}
                                type="button"
                              >
                                <Icon icon="heroicons:pencil-square" />
                              </button>
                            </Tooltip>

                                            <Tooltip
                                              content="Delete"
                                              placement="top"
                                              arrow
                                              animation="shift-away"
                                              theme="danger"
                                            >
                                              <button
                                                className="action-btn"
                                                type="button"
                                                onClick={() => {
                                                  setSelectedOrder(item);
                                                  setDelete_orderModal(true);
                                                }}
                                              >
                                                <Icon icon="heroicons:trash" />
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
                              <option
                                key={pageSizeOption}
                                value={pageSizeOption}
                              >
                                Show {pageSizeOption}
                              </option>
                            ))}
                          </select>
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            Page
                            <span>
                              {currentPage} of {totalPages}
                            </span>
                          </span>
                        </div>
                        <ul className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse">
                          <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                            <button
                              className={`${
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                                currentPage === totalPages
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
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
                    Aliqua id fugiat nostrud irure ex duis ea quis id quis ad
                    et. Sunt qui esse pariatur duis deserunt mollit dolore
                    cillum minim tempor enim. Elit aute irure tempor cupidatat
                    incididunt sint deserunt ut voluptate aute id deserunt nisi.
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Card>
        </div>
      </div>
      {!isBusiness == true ? ( // Conditionally rendering based on cart items
        <center>
          <h4 className="mt-10 text-2xl font-bold text-primary">
            Not a Business Account
          </h4>
        </center>
      ) : (
        <div>
          <br />
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            {businessinfo.map((item) => (
              <React.Fragment key={item?.user}>
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
                      {item.name}
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
                      {item.category}
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
                      {item.address}
                    </div>

                    {/* <span>{busi}</span>  */}
                  </div>
                </Card>
                {item.isRegistered == true ? (
                  <>
                    <Card>
                      <div className="space-y-6">
                        <div className="flex space-x-3 rtl:space-x-reverse items-center">
                          <div className="flex-none h-8 w-8 rounded-full bg-success-500 text-white flex flex-col items-center justify-center text-lg">
                            <Icon icon="entypo:address" />
                          </div>
                          <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                            RC Number
                          </div>
                        </div>
                        <div className="flex-1 text-base text-slate-900 dark:text-white font-medium">
                          {item.rcNumber}
                        </div>

                        {/* <span>{busi}</span>  */}
                      </div>
                    </Card>
                  </>
                ) : (
                  " "
                )}
              </React.Fragment>
            ))}
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
    title: "Loan",
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