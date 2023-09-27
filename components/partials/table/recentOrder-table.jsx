"use client";

import React,{useEffect,useState,useRef, useMemo} from "react";
import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RecentOrderTable = () => {
  const [orderItems, setOrderItems] = useState([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter


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
const endIndex = Math.min(startIndex + itemsPerPage, orderItems.length);

const last25Items = orderItems.slice(-25);

// Sort the last 25 items by the 'id' property in ascending order
last25Items.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return idB - idA; // Sort in ascending order by 'id'
});

// Get the paginated history data for the current page
const paginatedHistory = last25Items.slice(startIndex, endIndex);


// Calculate the total number of pages
const totalPages = Math.ceil(last25Items.length / itemsPerPage);

const getPageNumbers = () => {
  const totalPages = Math.ceil(last25Items.length / itemsPerPage);
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
        setOrderItems(res.cart);
      } else if (res.code === 401) {
        // Handle unauthorized user
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    });
  }, []);
  



  return (
    <>
    <ToastContainer/>
      <div>
      <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr >
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
                          /></td>
                        <td className="table-td py-2"> {item.product?.product_name} </td>
                        <td className="table-td py-2">  {naira.format(item.product?.price || "0")}</td>
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
                            <Link href={`/Orders/${item.cart_info.id}`}>
                              <button className="action-btn" type="button">
                                <Icon icon="heroicons:eye" />
                              </button>
                              </Link>
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
        <div className="md:flex md:space-y-0 space-y-5 justify-center mt-6 items-center">
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {getPageNumbers().map((pageNumber) => (
              <li key={pageNumber}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageNumber === currentPage
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                 {pageNumber}
                </button>
              </li>
            ))}

            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Icon icon="heroicons-outline:chevron-right" />
              </button>
            </li>
          </ul>
        </div>
       
      </div>
    </>
  );

};

export default RecentOrderTable;
