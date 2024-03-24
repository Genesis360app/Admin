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
import { orderService } from "@/services/order.services";

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
  const idA = a?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b?.id || 0; // Use a default value if 'b.cart_info.id' is null

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
    const fetchData = async () => {
      try {
        const response = await orderService.fetchOrders(); // Call fetchUsers as a function

        if (response) {
          // console.log(response); // Use response.data
          setOrderItems(response);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    fetchData();
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
                {paginatedHistory.map((item) => (
                  <React.Fragment key={item?.id}>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      <tr>
                        <td className="table-td py-2">
                          {" "}
                          <span>
                            {item.id.slice(0, 8)}...{item.id.slice(-10)}
                          </span>
                        </td>
                        <td className="table-td py-2 ">
                          {" "}
                          {item.user?.username}{" "}
                        </td>
                        <td className="table-td py-2 ">
                          {" "}
                          {"+234" + "" + item.phone}{" "}
                        </td>

                       

                        <td className="table-td py-2 ">
                          {item.trackingId?.location || "No Location"}
                        </td>
                        <td className="table-td py-2">
                          {" "}
                          {naira.format(item?.totalPrice || "0")}
                        </td>
                        <td className="table-td py-2">
                          {" "}
                          {item.transaction?.paymentMode}{" "}
                        </td>

                        <td className="table-td py-2"> {item?.city} </td>
                        <td className="table-td py-2">
                          <span className="block w-full">
                            <span
                              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                item.trackingId?.status === "Delivered"
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
                                item.trackingId?.status === "In-transit"
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
                          {" "}
                          {formattedDate(item?.dateOrdered)}{" "}
                        </td>
                        <td className="table-td py-2">
                          {" "}
                          {formattedDate(
                            item.trackingId?.estimatedDelivery
                          )}{" "}
                        </td>
                        <td className="table-td py-2">  <div className="flex space-x-3 rtl:space-x-reverse">
                            <Tooltip content="View" placement="top" arrow animation="shift-away">
                            <Link href={`/Order/${item?.id}`}>
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
