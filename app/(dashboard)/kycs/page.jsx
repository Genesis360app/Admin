"use client";
/* eslint-disable react/display-name */
import React, { useEffect, useState, useMemo } from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { kycService } from "@/services/kyc.services";
import HTMLReactParser from "html-react-parser";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigate } from "react-router-dom";
import Alert from "@/components/ui/Alert";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
import ProductBredCurbs from "@/components/partials/ProductBredCurbs";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/components/ui/Carousel"), {
  ssr: false,
});

import { SwiperSlide } from "swiper/react";


// find current step schema

const AllOrders = ({ title = "All Kycs", item }) => {
  const getStatus = (status ) => {
    switch (status) {
     case "Pending":
       return "Pending";
     case "Paid":
       return "Paid";
     case  "Proccessing":
       return "Proccessing";
     case "In-Transit":
       return "In-Transit";
     case "Delivered":
       return "Delivering";
     case "Closed":
       return "Closed";
     default:
       return "";
    }
  
   }

  const router = useRouter();
  // handleClick to view project single page
  const handleClick = async (item) => {
    router.push(`/kyc/${item?.user?.id}`);
  };

  const [allKycs, setAllKycs] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [activeModal, setActiveModal] = useState(false);
  const [status_, setStatus_] = useState();
  const orderStatus = getStatus(status_);
  const [delete_orderModal, setDelete_orderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const steps = ["Pending", "Paid", "Proccessing", "In-Transit", "Delivering", "Closed"];
  const statusIndex = steps.indexOf(orderStatus);
  const [totalPages, setTotalPages] = useState(1);
  

  // // Determine if the order is complete
  // const isComplete = orderStatus === "complete";

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

  // const last25Items = allKycs;

  // // Sort the last 25 items by the 'id' property in ascending order
  // last25Items.sort((a, b) => {
  //   const idA = a?.id || 0; // Use a default value if 'a.cart_info.id' is null
  //   const idB = b?.id || 0; // Use a default value if 'b.cart_info.id' is null

  //   return idB - idA; // Sort in ascending order by 'id'
  // });

  // Function to filter data based on globalFilter value
  // Function to filter data based on globalFilter value
  const filteredData = useMemo(() => {
    return (allKycs || []).filter((item) => {
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
  }, [allKycs, globalFilter]);

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

// Handle next page click
const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage((prevPage) => prevPage + 1);
    
  }
};

// Handle previous page click
const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage((prevPage) => prevPage - 1);
  }
};

  

// Calculate the index range for the current page
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = Math.min(startIndex + itemsPerPage, allKycs.length);

// Get the paginated data for the current page
const paginatedHistory = allKycs.slice(startIndex, endIndex);

  // Calculate the total number of pages
  // const totalPages = Math.ceil(filteredData.length / itemsPerPage);

 
  
  const handlePrint = () => {
    window.print();
  };

  // const getPageNumbers = () => {
  //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  //   const middlePage = Math.ceil(maxPageButtons / 2);

  //   let startPage = currentPage - middlePage + 1;
  //   let endPage = currentPage + middlePage - 1;

  //   if (totalPages <= maxPageButtons) {
  //     startPage = 1;
  //     endPage = totalPages;
  //   } else if (currentPage <= middlePage) {
  //     startPage = 1;
  //     endPage = maxPageButtons;
  //   } else if (currentPage >= totalPages - middlePage) {
  //     startPage = totalPages - maxPageButtons + 1;
  //     endPage = totalPages;
  //   }

  //   const pageNumbers = [];
  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(i);
  //   }

  //   return pageNumbers;
  // };

  // Function to handle printing
 
  

  const getPageNumbers = () => {
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
 
  const fetchData = async () => {
    try {
      const response = await kycService.fetchKycs(currentPage, itemsPerPage);
      if (response && response.success) {
        setAllKycs(response.data);
        console.log(response);
        setTotalPages(Math.ceil(response.totalCount / itemsPerPage));
      } else {
        // Handle case where response or response.data is undefined
      }
    } catch (err) {
      // Handle error
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage]);

  

  const handleItemClick = (item) => {
    setSelectedOrder(item);
    setActiveModal(true);


  };

 

  return (
    <>
      <ToastContainer />

      {/* <Modal
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
                      Customer Name
                    </th>
                    <th scope="col" className="table-th">
                      Mobile Number
                    </th>
                    <th scope="col" className="table-th">
                      Gender
                    </th>
                    <th scope="col" className="table-th">
                      ID Type
                    </th>
                    <th scope="col" className="table-th">
                      Place of Work
                    </th>

                    <th scope="col" className="table-th">
                      City
                    </th>
                    <th scope="col" className="table-th">
                      State
                    </th>

                    <th scope="col" className="table-th">
                      Date
                    </th>
                    
                    <th scope="col" className="table-th">
                      Status
                    </th>
                    <th scope="col" className="table-th">
                      Action
                    </th>
                    
                   
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  <tr>
                    <td className="py-2 table-td">
                      
                      <span>
                        {selectedOrder?.id.slice(0, 8)}...
                        {selectedOrder?.id.slice(-10)}
                      </span>
                    </td>
                    <td className="py-2 table-td">
                      {selectedOrder?.user?.fullName}
                    </td>
                    <td className="py-2 table-td">
                      {"+234" + "" + selectedOrder?.phone}
                    </td>
                    <td className="py-2 table-td ">
                    {selectedOrder?.trackingId?.location || "No Location"}
                    </td>
                    <td className="py-2 table-td">
                      
                      {naira.format(selectedOrder?.totalPrice || "0")}
                    </td>
                    <td className="py-2 table-td">
                    {selectedOrder?.transaction?.paymentMode || "Unknown Payment Mode"}
                    </td>
                    <td className="py-2 table-td"> {selectedOrder?.city} </td>
                    <td className="py-2 table-td">
                      <span className="block w-full">
                        <span
                          className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                            selectedOrder?.trackingId?.status === "Delivered"
                              ? "text-success-500 bg-success-500"
                              : ""
                          } 
            ${
              selectedOrder?.trackingId?.status === "Paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              selectedOrder?.trackingId?.status === "Proccessing"
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
                            selectedOrder?.trackingId?.status === "In-Transit"
                              ? "text-primary-500 bg-primary-500"
                              : ""
                          }
            
             `}
                        >
                          {selectedOrder?.trackingId?.status}
                        </span>
                      </span>
                    </td>
                    <td className="py-2 table-td">
                      {formattedDate(selectedOrder?.dateOrdered)}
                    </td>
                    <td className="py-2 table-td">
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
      </Modal>
 */}

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
                      Customer Name
                    </th>
                    <th scope="col" className="table-th">
                      Mobile Number
                    </th>
                    <th scope="col" className="table-th">
                      Gender
                    </th>
                    <th scope="col" className="table-th">
                      ID Type
                    </th>
                    <th scope="col" className="table-th">
                      Place of Work
                    </th>

                    <th scope="col" className="table-th">
                      City
                    </th>
                    <th scope="col" className="table-th">
                      State
                    </th>

                    <th scope="col" className="table-th">
                      Date
                    </th>
                    
                    <th scope="col" className="table-th">
                      Status
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
                        <td className="py-2 table-td">
                          {" "}
                          <span>
                            {item.id.slice(0, 8)}...{item.id.slice(-10)}
                          </span>
                        </td>
                        <td className="py-2 table-td ">
                          {" "}
                          {item.user?.fullName}{" "}
                        </td>
                        <td className="py-2 table-td ">
                          {" "}
                          {"+234" + "" + item?.user?.phone}{" "}
                        </td>

                       

                        <td className="py-2 table-td ">
                          {item?.gender}
                        </td>
                        <td className="py-2 table-td">
                          {" "}
                          {item?.idType}
                        </td>
                        <td className="py-2 table-td">
                          {" "}
                          {item?.placeOfWork}
                        </td>

                        <td className="py-2 table-td"> {item?.city} </td>
                        <td className="py-2 table-td"> {item?.state} </td>
                        <td className="py-2 table-td">
                          {formattedDate(item?.dateOrdered)}
                        </td>
                        <td className="py-2 table-td">
                          <span className="block w-full">
                            <span
                              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                item?.status === "Approved"
                                  ? "text-success-500 bg-success-500"
                                  : ""
                              } 
            
                              ${
                                item?.status === "Closed"
                                  ? "text-danger-500 bg-danger-500"
                                  : ""
                              }
                                  ${
                                    item?.status === "Pending"
                                      ? "text-pending-500 bg-pending-500"
                                      : ""
                                  } 
                              
                              `}
                                              >
                              {item?.status}
                            </span>
                          </span>
                        </td>

                      
                       

                        <td className="py-2 table-td">
                          {" "}
                          <div className="flex space-x-3 rtl:space-x-reverse">
                            {/* <Tooltip
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
                            </Tooltip> */}

                            <Tooltip
                              content="View Kyc"
                              placement="top"
                              arrow
                              animation="shift-away"
                            >
                              <button
                                className="action-btn"
                                //  onClick={() => router.push(`/order/${item.cart_info.id}`)}
                                onClick={() => handleClick(item)}
                                type="button"
                              >
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
      <span>
        {currentPage} of {totalPages}
      </span>
    </span>
  </div>
  <ul className="flex flex-wrap items-center space-x-3 rtl:space-x-reverse">
    <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
      <button
        className={`${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
      >
        <Icon icon="heroicons:chevron-double-left-solid" />
      </button>
    </li>
    <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
      <button
        className={`${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handlePrevPage} disabled={currentPage === 1}
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
       onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}
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
