"use client";

import React, { useEffect, useState, useMemo } from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import Badge from "@/components/ui/Badge";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import axios from "axios"; // Import Axios at the top of your file
import { walletService } from "@/services/wallet.services";
import { _notifySuccess, _notifyError } from "@/utils/alart";

const AllLoans = ({ title = "All Loans", item }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [allLoan, setAllLoan] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null); // State to store the selected order data
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

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

  const last25Items = allLoan;

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
      const loan_id = (item?.id || "").toString(); // Access product_name safely and convert to lowercase
      const totalLoan = (item?.totalLoan || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        loan_id.includes(filterText.toLowerCase()) ||
        totalLoan.includes(filterText.toLowerCase())
      );
    });
  }, [allLoan, globalFilter]);

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
  const paginatedLoan = filteredData.slice(startIndex, endIndex);

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
        const response = await walletService.fetchLoans(); // Call fetchUsers as a function

        if (response) {
          console.log(response);
          setAllLoan(response);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  // Loan approval

  const handleApproveLoan = async (loanId) => {
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
        action: "approve", // Use the correct status for approval
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/loan/update-status/${selectedLoan?.id}/${loanId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
            cache: "no-store",
          },
          body: body,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        _notifySuccess(responseData.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(`Failed to approve Loan: ${response}`);
      }
    } catch (error) {
      console.error("Error during Loan approval:", error);
      _notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRejectedLoan = async (loanId) => {
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
        action: "reject", // Use the correct status for approval
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/loan/update-status/${selectedLoan?.id}/${loanId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
            cache: "no-store",
          },
          body: body,
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        // console.log(responseData);
        _notifySuccess(responseData.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(`Failed to approve Loan: ${response}`);
      }
    } catch (error) {
      console.error("Error during Loan approval:", error);
      _notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      <Modal
        className="w-[48%]"
        activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title="Loan Details"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setActiveModal(false)}
            router={router}
          />
        }
      >
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="table-th">
                      Loan ID
                    </th>
                    <th scope="col" className="table-th">
                      Amount
                    </th>
                    <th scope="col" className="table-th">
                      Repayment Mode
                    </th>
                    <th scope="col" className="table-th">
                      Interest Rate
                    </th>
                    <th scope="col" className="table-th">
                      Status
                    </th>
                    <th scope="col" className="table-th">
                      Due Date
                    </th>
                    <th scope="col" className="table-th">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                  {selectedLoan?.loanItems?.map((item) => (
                    <tr key={item?._id}>
                      <td className="table-td py-2"> {item?._id}</td>
                      <td className="table-td py-2">
                        {naira.format(item?.amount)}
                      </td>

                      <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                        {item?.repayment}{" "}
                      </td>
                      <td className="table-td py-2">{item?.interestRate}%</td>
                      <td className="table-td py-2">
                        <span className="block w-full">
                          <span
                            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                              item?.status === "Approved"
                                ? "text-success-500 bg-success-500"
                                : ""
                            } 
            ${
              item?.status === "Rejected" ? "text-danger-500 bg-danger-500" : ""
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

                      <td className="table-td py-2">
                        {formattedDate(item?.dueDate)}
                      </td>
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
                                onClick={() => {
                                  // setSelectedLoanId(item?._id);
                                  handleApproveLoan(item?._id);
                                }}
                                disabled={isLoading}
                              >
                                <div className="hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50 w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex space-x-2 items-center rtl:space-x-reverse">
                                  <span className="text-base">
                                    <Icon icon="mdi:approve" />
                                  </span>
                                  <span>
                                    {" "}
                                    {isLoading ? "Updating..." : "Approve"}
                                  </span>
                                </div>
                              </Menu.Item>

                              <Menu.Item
                                onClick={() => {
                                  // setSelectedLoanId(item?._id);
                                  handleRejectedLoan(item?._id);
                                }}
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
                                    {isLoading ? "Updating..." : "Deny"}
                                  </span>
                                </div>
                              </Menu.Item>
                            </div>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <br />
                <br />
                <br />
              </table>
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
                      Total Loan
                    </th>
                    <th scope="col" className="table-th">
                      Overdue
                    </th>

                    <th scope="col" className="table-th">
                      Action
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
                        <td className="table-td py-2">
                          {naira.format(item?.totalLoan || "0")}
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
                                  setSelectedLoan(item);
                                  setActiveModal(true);
                                }}
                              >
                                <Icon icon="heroicons:eye" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </React.Fragment>
                ))}
                <br />
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

export default AllLoans;
