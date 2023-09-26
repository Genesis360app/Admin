"use client";

import React,{useEffect,useState,useRef, useMemo} from "react";
import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import { recentOrder } from "@/constant/table-data";

import Icon from "@/components/ui/Icon";

import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { useRouter } from "next/navigation";


const RecentOrderTable = () => {
  const [orderItems, setOrderItems] = useState([]);
  const router = useRouter();

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
  

const naira = new Intl.NumberFormat('en-NG', {
  style : 'currency', 
  currency: 'NGN',
 maximumFractionDigits:0,
 minimumFractionDigits:0

});

const last25Items = orderItems.slice(-25);

// Sort the last 25 items by the 'id' property in ascending order
last25Items.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return idB - idA; // Sort in ascending order by 'id'
});

const allOrder = last25Items.map((item, i) => ({
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
      Header: "channel",
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
          const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
          const formattedDate = date.toLocaleString(undefined, options); // Format the date with time
          return <span>{formattedDate}</span>;
        } else {
          return <span>Invalid Date</span>;
        }
        
      },
    },
  ];
 
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => allOrder, []);

  

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 6,
      },
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
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

  const { pageIndex, pageSize } = state;
  


  return (
    <>
    <ToastContainer/>
      <div>
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
        <div className="md:flex md:space-y-0 space-y-5 justify-center mt-6 items-center">
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons-outline:chevron-left" />
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${
                    pageIdx === pageIndex
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                      : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                  }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
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
