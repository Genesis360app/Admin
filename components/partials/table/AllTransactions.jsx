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
import GlobalFilter from "./GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

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

const AllTransaction = ({ title = "All Transaction" }) => {
  const [history, setHistory] = useState([]);
  const [activeModal, setActiveModal] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null); // To store the selected history details
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
    return (history || []).filter((item) => {
      const transaction_ref = (item?.transaction_ref || "").toString(); // Access product_name safely and convert to lowercase
      const txn_Id = (item?.id || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.created_at) || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        transaction_ref.includes(filterText.toLowerCase()) ||
        txn_Id.includes(filterText) ||
        date.includes(filterText)
      );
    });
  }, [history, globalFilter]);

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
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Wallet/History.php`, {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        // console.log(res);
        if (res.code == 200) {
          setHistory(res.history);
        } else if (res.code == 401) {
          toast.info(`An error occurred, please login again`, {
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
      });
  }, []);

  return (
    <>
      <ToastContainer />

      <Modal
        activeModal={activeModal}
        onClose={() => setActiveModal(false)}
        title="Transaction Details"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setActiveModal(false)}
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
                # {selectedHistory?.id}
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
                Transaction Ref
              </h2>
              <p className="text-[20px] leading-[20px] font-medium mt-[5px] ">
                {selectedHistory?.transaction_ref}
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
                {selectedHistory?.remark}
              </p>
            </div>
            <div>
              <h2 className="text-[20px] leading-[25px] font-bold text-right">
                Transaction Type
              </h2>
              <p className="text-[20px] leading-[20px] text-right font-medium mt-[5px]">
                {selectedHistory?.txn_type}
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
                {selectedHistory?.userid}
              </p>
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
                      Amount
                    </th>
                    <th scope="col" className="table-th">
                      Txn Type
                    </th>
                    <th scope="col" className="table-th">
                      Remark
                    </th>
                    <th scope="col" className="table-th">
                      Reference Id
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
                          <span>{item.id}</span>
                        </td>
                        <td className="table-td">{item.amount}</td>
                        <td className="table-td">{item.txn_type}</td>
                        <td className="table-td">
                          <span className="text-slate-500 dark:text-slate-400">
                            <span className="block text-slate-600 dark:text-slate-300">
                              {item.remark}
                            </span>
                          </span>
                        </td>
                        <td className="table-td">
                          <span className="text-slate-500 dark:text-slate-400">
                            <span className="block text-xs text-slate-500">
                              Trans ID: {item.transaction_ref}
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
                          {formattedDate(item.created_at)}
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
