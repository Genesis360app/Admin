/* eslint-disable react/display-name */
import React, { useState, useMemo, useEffect } from "react";
// import { advancedTable } from "../../../constant/table-data";
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
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { vieworders } from "@/components/partials/app/projects/store";
import ViewOrders from "@/components/partials/app/projects/ViewOrders";

//   const ExampleTwo: React.FC<OrderRowProps> = ({ item,title = "Advanced Table Two" }) => {
const ExampleTwo = ({ item,title = "Advanced Table Two" }) => {



  const [orderItems, setOrderItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order data
  const dispatch = useDispatch();
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        var token = localStorage.getItem("token");
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/getOrders.php`, {
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
  
        console.log(res);
  
        if (res.code === 200) {
          setOrderItems(res.cart);
        } else if (res.code === 401) {
          setTimeout(() => {
            router.push("/login");
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
  
    fetchData(); // Call the asynchronous function
  }, []);
  

const naira = new Intl.NumberFormat('en-NG', {
  style : 'currency', 
  currency: 'NGN',
 maximumFractionDigits:0,
 minimumFractionDigits:0

});

const last25Items = orderItems.slice(-25);

// Sort the last 25 items by the 'id' property in ascending order
orderItems.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return idB - idA; // Sort in ascending order by 'id'
});

const recentOrder = orderItems.map((item, i) => ({
  id: item.cart_info?.id || i, // Use a default value if 'item.product' or 'item.product.id' is null
  image: item.product?.image,
  product_name: item.product?.product_name,
  price: item.product?.price || "0",
  qty: item.cart_info?.qty || "0",
  channel: item.product?.channel || "BNPL",
  status: item.order_tracking?.current_status.name,
  date: item.cart_info?.created_at,
}));

const COLUMNS = [
  {
    Header: "id",
    accessor: "id",
    Cell: (row) => {
      return <span>#{row?.cell?.value}</span>;
    },
  },
  {
    Header: "image",
    accessor: "image",
    Cell: (row) => {
      return (
      <div>
          <div className="flex items-center">
            <div className="flex-none">
              <div className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                <img
                 
                  src={row?.cell?.value || "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"}
                  width={70}
                  height={70}
                  alt=""
                  className="w-full h-full rounded-[5%] object-cover"
                />
              </div>
            </div>
            
          </div>
        </div>
      );
    },
  },

  {
    Header: "product name",
    accessor: "product_name",
    Cell: (row) => {
      return <h4 className="text-sm font-medium text-slate-600">{row?.cell?.value}</h4>;
    },
  },

  {
    Header: "price",
    accessor: "price",
    Cell: (row) => {
      return <span>{naira.format(parseFloat(row?.cell?.value))}</span>;
    },
  },
  {
    Header: "payment channel",
    accessor: "channel",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "qty",
    accessor: "qty",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },

  {
    Header: "status",
    accessor: "status",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              row?.cell?.value === "delivered"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              row?.cell?.value === "closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              row?.cell?.value === "paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              row?.cell?.value === "processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              row?.cell?.value === "closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  row?.cell?.value === "pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
              row?.cell?.value === "in-transit"
                ? "text-primary-500 bg-primary-500"
                : ""
            }
            
             `}
          >
            {row?.cell?.value}
          </span>
        </span>
      );
    }, 
  },
  

  {
    Header: "date",
    accessor: "date",
    Cell: (row) => {
      const rawDate = row?.cell?.value;
      const date = new Date(rawDate);
      
      if (!isNaN(date.getTime())) {
        const formattedDate = date.toLocaleDateString(); // Format the date as needed
        return <span>{formattedDate}</span>;
      } else {
        return <span>Invalid Date</span>;
      }
    },
  },

  {
    Header: "action",
    accessor: "action",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="View" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button"   onClick={(item) => dispatch(vieworders(item))}>
              <Icon icon="heroicons:eye" />
            </button>
          </Tooltip>
          <Tooltip content="Edit" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button"  >
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>
          {/* <Tooltip
            content="Delete"
            placement="top"
            arrow
            animation="shift-away"
            theme="danger"
          >
            <button className="action-btn" type="button">
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip> */}
        </div>
      );
    },
  },
];

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

const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => recentOrder, []);

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;
  
  const maxPageButtons = 5;

  // Calculate the start and end indices of the page buttons to display
  let startIdx = Math.max(0, pageIndex - Math.floor(maxPageButtons / 2));
  let endIdx = Math.min(pageOptions.length - 1, startIdx + maxPageButtons - 1);
  
  if (endIdx - startIdx < maxPageButtons - 1) {
    // Adjust the start index if the calculated range is less than the maximum
    startIdx = Math.max(0, endIdx - maxPageButtons + 1);
  }


  return (
    <>
    <ToastContainer/>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
              <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    const { key, ...restRowProps } = row.getRowProps();
                    return (
                      <tr key={key} {...restRowProps}>
                        {row.cells.map((cell) => {
                          const { key, ...restCellProps } = cell.getCellProps();
                          return (
                            <td
                              key={key}
                              {...restCellProps}
                              className="table-td"
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50,100,500].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Page{" "}
              <span>
                {pageIndex + 1} of {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse flex-wrap">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {pageOptions.slice(startIdx, endIdx + 1).map((page, pageIdx) => (
      <li key={pageIdx}>
        <button
          href="#"
          aria-current="page"
          className={`${
            pageIdx === pageIndex
              ? "bg-slate-900 dark:bg-slate-600 dark:text-slate-200 text-white font-medium "
              : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
          }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
          onClick={() => gotoPage(startIdx + pageIdx)} // Adjust the page index based on the start index
        >
          {page + 1}
        </button>
      </li>
    ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
        <ViewOrders />
      </Card>    
    </>
  );
};

export default ExampleTwo;
