 "use client"


/* eslint-disable react/display-name */
import React, { useEffect, useState, useMemo } from "react";
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
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { userService } from "@/services/users.service";
import { Naira } from "@/utils/alart";
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

const AllTransaction = ({ title = "Contact Us Messages" }) => {
  const [allContact, setAllContact] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [selectedmessage, setSelectedmessage] = useState(null); // To store the selected history details
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

  // Function to filter data based on globalFilter value
  // Function to filter data based on globalFilter value
  const filteredData = useMemo(() => {
    return (allContact || []).filter((item) => {
      const name = (item?.description || "").toString(); // Access product_name safely and convert to lowercase
      const subject = (item?.description || "").toString(); // Access product_name safely and convert to lowercase
      const email = (item?.amount || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.created_at) || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        name.includes(filterText.toLowerCase()) ||
        subject.includes(filterText) ||
        email.includes(filterText)||
        date.includes(filterText)
      );
    });
  }, [allContact, globalFilter]);

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
    const transactionData = async () => {
      try {
        const response = await userService.contactUs(); // Call fetchUsers as a function

        if (response) {
        //   console.log(response); // Use response.data
          setAllContact(response);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    transactionData();
  }, []);

  return (
    <>
      <ToastContainer />

      <Modal
        activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title={selectedmessage?.name + " " + "Message"}
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setActiveModal(false)}
          />
        }
      >

<div>
        <div className="text-lg font-medium text-slate-600 dark:text-slate-300">
          {selectedmessage?.subject}
        </div>
        <div className="flex space-x-3 pt-4 pb-6 items-start rtl:space-x-reverse">
          <div className="flex-none">
           
          </div>
          <div className="flex-1">
            <span className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-4">
            {selectedmessage?.name}
            </span>
          </div>
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-300 font-normal">
        {selectedmessage?.email}
          <br />
          <br />
          {selectedmessage?.message}
          
          <br />
          <br />
          ID : {selectedmessage?._id}  <br />
          Name: {selectedmessage?.name} <br />
          Date: {formattedDate(selectedmessage?.createdAt)}
        </div>
        <div className="border-t border-b py-4 my-6 border-slate-100 dark:border-slate-700 flex flex-wrap space-x-5 rtl:space-x-reverse">
          <div className="text-center">
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
                      Name
                    </th>
                    <th scope="col" className="table-th">
                      Email
                    </th>
                    <th scope="col" className="table-th">
                    Subject
                    </th>
                    {/* <th scope="col" className="table-th">
                    Message
                    </th> */}
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
                            {item._id.slice(0, 8)}...{item._id.slice(-10)}
                          </span>
                        </td>
                        <td className="table-td">
                          {item.name}
                        </td>
                        <td className="table-td">{item.email}</td>
                        <td className="table-td">
                          <span className="text-slate-500 dark:text-slate-400">
                            <span className="block text-slate-600 dark:text-slate-300">
                              {item.subject}
                            </span>
                          </span>
                        </td>
                        {/* <td className="table-td">
                        <span className="text-slate-500 dark:text-slate-400">
                            <span className="block text-slate-600 dark:text-slate-300">
                              {item.message}
                            </span>
                          </span>
                        </td> */}
                        <td className="table-td">{formattedDate(item.createdAt)}</td>
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
                                  setSelectedmessage(item);
                                  setActiveModal(true);
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

export default AllTransaction;
