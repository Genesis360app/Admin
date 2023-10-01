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
import GlobalFilter from "./GlobalFilter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Link from "next/link"; 
import { useRouter } from 'next/navigation'
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input
          type="checkbox"
          ref={resolvedRef}
          {...rest}
          className="table-checkbox"
        />
      </>
    );
  }
);



 // find current step schema
 

const AllSubcriptions = ({ title = "All Subscriptions", item }) => {

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

  const router = useRouter()

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
  const [shippingState, setShippingState] = useState("");
  const [status_, setStatus_] = useState(0);
  const orderStatus = getStatus(status_);
  const steps = ["pending", "Paid", "Processing", "in-transit", "delivering", "complete"];
  const statusIndex = steps.indexOf(orderStatus);
  const [isLoading, setIsLoading] = useState(false);


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

    //   console.log(res);

      if (res.code === 200) {
        setOrderItems(res.cart);
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
    

const actions = [
    {
        name: "Approve",
        icon: "mdi:approve",
        doit: (item) => {
          setSelectedOrder(item);
          setActiveModal(true);
        },
      },
      
    {
      name: "Pend",
      icon: "material-symbols:pending-actions-rounded",
      doit: "(item) => dispatch(updateProject(item))",
    },
    {
      name: "Query",
      icon: "streamline:interface-help-question-square-frame-help-mark-query-question-square",
      doit: "   ",
    },
    {
      name: "Deny",
      icon: "fluent:shifts-deny-24-regular",
      doit: "   ",
    },
  ];

  return (
    <>
    <ToastContainer/>

    
    
    <Modal className="w-[49%]"
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
     <center> 
    
    <Card title=" Status Variation Badges ">


    {/* {cartItems.map((item) => (

            <div key={item.cart_info.id}> */}
        <div className="space-xy-5">

          <Button className="bg-secondary-500 text-white"
        //    onClick={() => handlePendingStatus('pending', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Approve'}</span>
              <Badge  icon="mdi:approve" className="bg-white text-slate-900 " />
            </div>
          </Button>
          
          <Button className="btn-info"
            // onClick={() => handlePaidStatus('Paid', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Pend'}</span>
              <Badge  icon="material-symbols:pending-actions-rounded" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-warning"
        //    onClick={() => handleProcessingStatus('Processing', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Query'}</span>
              <Badge  icon="streamline:interface-help-question-square-frame-help-mark-query-question-square" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-dark"
        //    onClick={() => handleTransitStatus('In-Transit', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Deny '}</span>
              <Badge  icon="fluent:shifts-deny-24-regular" className="bg-white text-slate-900" />
            </div>
          </Button>
        
       
        </div>
        {/* </div>
        ))}    */}
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
                    Package Name
                    </th>
                    <th scope="col" className="table-th">
                    Discount
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
                                : item.product.image
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
                {actions.map((item, i) => (
                  <Menu.Item
                    key={i}
                    onClick={() => item.doit(item)}
                  >
                    <div
                      className={`
                
                  ${
                    item.name === "Deny"
                      ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                      : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                  }
                   w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                   first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                    >
                      <span className="text-base">
                        <Icon icon={item.icon} />
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </Menu.Item>
                ))}
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
