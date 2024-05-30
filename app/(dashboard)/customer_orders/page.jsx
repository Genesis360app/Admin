"use client";
/* eslint-disable react/display-name */
import React, { useEffect, useState, useMemo } from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import { orderService } from "@/services/order.services";
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

const AllOrders = ({ title = "All Orders", item }) => {
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
    router.push(`/order/${item?.id}`);
  };

  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedHistory, setpaginatedHistory] = useState([])
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

  const filteredData = useMemo(() => {
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

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

// Handle next page click
const handleNextPage = () => {
  if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
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
const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const handlePrint = () => {
    window.print();
  };
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
      const response = await orderService.fetchOrders(currentPage, itemsPerPage);
      if (response && response.success) {
        setOrderItems(response.data);
        // console.log(response);
        setpaginatedHistory(response.data);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      } else {
        // Handle case where response or response.data is undefined
      }
    } catch (err) {
      // Handle error
    }
  };
// console.log(paginatedHistory)
useEffect(() => {
    fetchData();
}, [currentPage, itemsPerPage]);

  

  const handleItemClick = (item) => {
    setSelectedOrder(item);
    setActiveModal(true);

    // Navigate to another page and pass the selected item as a state
    history.push("/anotheroPage", { selectedItem: item });
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
      
      // console.log(userById);
      //       console.log(user.token);
  
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
      // console.error("Error during oder deletion:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <>
      <ToastContainer />

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
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {selectedOrder?.orderItems?.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 table-td">
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
                      <td className="py-2 table-td">{item.product?.name}</td>
                      <td className="py-2 table-td">{item.product?.price}</td>
                      <td className="py-2 table-td">{item?.quantity}</td>
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
        title= {selectedOrder?.id}
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
              src={ "https://p.turbosquid.com/ts-thumb/Kc/2Qw5vF/rQ/searchimagetransparentalternative_whitebg/png/1680707751/300x300/sharp_fit_q85/cdff1a28155c195262452dd977d32caa67becfc8/searchimagetransparentalternative_whitebg.jpg"
                 
              }
                alt="order"
              
              className="w-[150px] h-[150px] rounded-md "
            />

            <div className="pt-4 pb-1 text-lg text-slate-600 dark:text-slate-200">
              <p className="font-bold">Are you sure you want to delete this Oder ?</p>
            </div>
            <div className="pb-1 text-lg rounded-lg text-slate-600 dark:text-slate-200">
            {selectedOrder?.id}
            </div>
            <div className="pb-1 text-lg text-slate-600 dark:text-slate-200">
            {naira.format(selectedOrder?.totalPrice)}
            </div>
            <div className="pb-1 text-lg text-slate-600 dark:text-slate-200">
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
                className="w-full alert-success light-mode"
              />
            ) : (
              ""
            )}
            <br />

            <div className="flex justify-center space-x-2 ltr:text-right rtl:text-left">
              <Button
                className="text-center btn btn-dark"
                onClick={() => setDelete_orderModal(false)}
              >
                Cancel
              </Button>

              <Button
                className="text-center btn btn-danger"
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
                          {"+234" + "" + item?.phone}{" "}
                        </td>

                       

                        <td className="py-2 table-td ">
                          {item.trackingId?.location || "No Location"}
                        </td>
                        <td className="py-2 table-td">
                          {" "}
                          {naira.format(item?.totalPrice || "0")}
                        </td>
                        <td className="py-2 table-td">
                          {" "}
                          {item.transaction?.paymentMode}{" "}
                        </td>

                        <td className="py-2 table-td"> {item?.city} </td>
                        <td className="py-2 table-td">
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
              item.trackingId?.status === "Proccessing"
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
                                item.trackingId?.status === "In-Transit"
                                  ? "text-primary-500 bg-primary-500"
                                  : ""
                              }
            
             `}
                            >
                              {item.trackingId?.status}
                            </span>
                          </span>
                        </td>

                        <td className="py-2 table-td">
                          {formattedDate(item?.dateOrdered)}
                        </td>
                        <td className="py-2 table-td">
                          {" "}
                          {formattedDate(
                            item.trackingId?.estimatedDelivery
                          )}{" "}
                        </td>

                        <td className="py-2 table-td">
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
                                //  onClick={() => router.push(`/order/${item.cart_info.id}`)}
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
