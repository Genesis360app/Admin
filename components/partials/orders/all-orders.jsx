'use client'
/* eslint-disable react/display-name */
import React,{useEffect,useState,useMemo} from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/GlobalFilter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigate } from "react-router-dom";






 // find current step schema
 

const AllOrders= ({ title = "All Orders", item }) => {

  const getStatus = (status ) => {
    switch (status) {
     case 0:
       return "pending";
     case 1:
       return "Paid";
     case 2:
       return "Processing";
     case 3:
       return "in-transit";
     case 4:
       return "delivering";
     case 5:
       return "complete";
     default:
       return "";
    }
  
   }

   const router = useRouter();
   // handleClick to view project single page
   const handleClick = (item) => {
     router.push(`/orders/${item.cart_info.id}`);
   };
  


  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [activeModal, setActiveModal] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [town, setTown] = useState("");
  const [priceTotal, setPriceTotal] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [status_, setStatus_] = useState(0);
  const orderStatus = getStatus(status_);
  const steps = ["pending", "Paid", "Processing", "in-transit", "delivering", "complete"];
  const statusIndex = steps.indexOf(orderStatus);
  

  // // Determine if the order is complete
  // const isComplete = orderStatus === "complete";
  



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

const last25Items = orderItems;

// Sort the last 25 items by the 'id' property in ascending order
last25Items.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return idB - idA; // Sort in ascending order by 'id'
});

// Function to filter data based on globalFilter value
// Function to filter data based on globalFilter value
const filteredData = useMemo(() => {
return (last25Items || []).filter((item) => {
  const cart_id = (item.cart_info?.id|| "").toString(); // Access product_name safely and convert to lowercase
  const product_name = (item.product?.product_name || "").toString(); // Access package_id safely and convert to string
  const qty = (item.cart_info?.qty|| "").toString(); // Access package_id safely and convert to string

  // Check if globalFilter is defined and not null before using trim
  const filterText = globalFilter ? globalFilter.trim() : "";

  // Customize this logic to filter based on your specific requirements
  return (
    cart_id.includes(filterText.toLowerCase()) ||
    product_name.includes(filterText)||
    qty.includes(filterText)
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


 // Function to handle printing
 const handlePrint = () => {
  window.print();
};

useEffect(() => {
  const fetchData = async () => {
    try {
      var token = localStorage.getItem("token");
      var userid = localStorage.getItem("userid");



      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getOrders.php`, {
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
        setOrderItems(res.cart);
        setPriceTotal(res.total);
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
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/orderById.php?orderid=${selectedOrder?.cart_info?.id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    // console.log(res);
    if (res.code === 200) {
      setCartItems(res.cart);
      setPriceTotal(res.total);
      setStatus_(parseInt(res.cart[0].cart_info.status));
      getDatePlus(res.created_at);
    } else if (res.code === 401) {
    
    }
  });

  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getShippingAddress.php?userid=${selectedOrder?.cart_info?.userid}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then((res) => {
    // console.log(res);
    if (res.code === 200) {
      setContactPhone(res.payload.phone);
      setShippingState(res.payload.state);
      setTown(res.payload.town);
      setStreetAddress(res.payload.address);
      setLandmark(res.payload.landmark);
      setHouseNumber(res.payload.house_number);
    } else if (res.code === 401) {
      // Handle the error appropriately
    }
  });

  fetchData(); // Call the asynchronous function
}, []);
    
const handleItemClick = (item) => {
  setSelectedOrder(item);
  setActiveModal(true);

  // Navigate to another page and pass the selected item as a state
  history.push('/anotherPage', { selectedItem: item });
};


  return (
    <>
    <ToastContainer/>

    
    
<Modal className="w-[60%]"
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
     <div>
 <Card >
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
                      <Icon icon="ic:twotone-pending-actions" />// Replace with your first icon
    
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
                   
                    </tr>
                </thead>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span> {selectedOrder?.cart_info?.id}</span></td>
                      <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                        <img
                            className="w-20 h-20 rounded"
                            src={
                              selectedOrder?.product === null
                                ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                                : selectedOrder?.product?.image
                            }
                            width={70}
                            height={70}
                            alt=""
                          /></td>
                        <td className="table-td py-2"> {selectedOrder?.product?.product_name} </td>
                        <td className="table-td py-2">  {naira.format(selectedOrder?.product?.price || "0")}</td>
                        <td className="table-td py-2"> BNPL</td>
                        <td className="table-td py-2"> {selectedOrder?.cart_info?.qty || "0"} </td>
                        <td className="table-td py-2"> 
                        <span className="block w-full">
            <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              selectedOrder?.order_tracking?.current_status.name === "delivered"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              selectedOrder?.order_tracking?.current_status.name === "closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              selectedOrder?.order_tracking?.current_status.name === "paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              selectedOrder?.order_tracking?.current_status.name === "processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              selectedOrder?.order_tracking?.current_status.name === "closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  selectedOrder?.order_tracking?.current_status.name=== "pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                  selectedOrder?.order_tracking?.current_status.name === "in-transit"
                ? "text-primary-500 bg-primary-500"
                : ""
            }
            
             `}
          >
            {selectedOrder?.order_tracking?.current_status.name}
          </span>
          </span>
              </td>
                        <td className="table-td py-2">  {formattedDate(selectedOrder?.cart_info?.created_at)} </td>

                      </tr>
                      </tbody>
                </table>
                </div>
                </div>
                </div>


                <br/>
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
    <Icon icon="heroicons:pencil-square" className="text-[#1c404d] w-7 h-8 cursor-pointer"  onClick={handlePrint} />
      
    </div>
  </div>
</div>
                         
  </Modal>


  
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
                {paginatedHistory.map((item) => (
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
                            <Tooltip content="View" placement="top" arrow animation="shift-away">
                            
                              <button className="action-btn" 
                              type="button"
                              onClick={() => {
                                setSelectedOrder(item);
                                 setActiveModal(true);
                             }}
                              >
                                <Icon icon="heroicons:eye" />
                              </button>
                            
                            </Tooltip>
             
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
    </>
  );
};

export default AllOrders;
