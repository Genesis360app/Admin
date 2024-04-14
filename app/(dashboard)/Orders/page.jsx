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

  const router = useRouter();
  // handleClick to view project single page
  const handleClick = async (item) => {
    router.push(`/order/${item?.id}`);
  };

  const [orderItems, setOrderItems] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [activeModal, setActiveModal] = useState(false);
  const [status_, setStatus_] = useState("");
  const orderStatus = getStatus(status_);
  const [delete_orderModal, setDelete_orderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const steps = [
    "Pending",
    "Paid",
    "Processing",
    "In-transit",
    "Delivering",
    "Complete",
  ];
  const statusIndex = steps.indexOf(orderStatus);

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

  // const last25Items = orderItems;

  // // Sort the last 25 items by the 'id' property in ascending order
  // last25Items.sort((a, b) => {
  //   const idA = a?.id || 0; // Use a default value if 'a.cart_info.id' is null
  //   const idB = b?.id || 0; // Use a default value if 'b.cart_info.id' is null

  //   return idB - idA; // Sort in ascending order by 'id'
  // });

  // Function to filter data based on globalFilter value
  // Function to filter data based on globalFilter value
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
        const response = await orderService.fetchOrders(); // Call fetchUsers as a function

        if (response) {
          // console.log(response.data); // Use response.data
          setOrderItems(response.data);
          // setStatus_(response.transaction.status);
          // console.log(response.transaction.status);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

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
                    {selectedOrder?.transaction?.paymentMode || "Unknown Payment Mode"}
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
                      {item.product?.description ? HTMLReactParser(item.product.description) : null}
                       
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

            <div className="text-slate-600 dark:text-slate-200 text-lg pt-4 pb-1">
              <p className="font-bold">Are you sure you want to delete this Oder ?</p>
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


      <div className="space-y-5 mb-5 ">
      <Card title="Broadcast Banner">
        <Carousel
          pagination={true}
          navigation={true}
          className="main-caro"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c1.png)`,
              }}
            >
                <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c2.png)`,
              }}
            >

            <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c3.png)`,
              }}
            >
                <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Carousel>
      </Card>
    
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
                          {"+234" + "" + item?.phone}{" "}
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
          {/* <p>Total Amount : <b>{naira.format(priceTotal)}</b> </p> */}
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
    </>
  );
};

export default AllOrders;
