"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import ProgressBar from "@/components/ui/ProgressBar";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import GlobalFilter from "../table/GlobalFilter";
import 'react-toastify/dist/ReactToastify.css';


const ProductGrid = ({ project, globalFilter }) => {
  const {startDate, endDate } = project;
  const dispatch = useDispatch();

  const [start, setStart] = useState(new Date(startDate));
  const [end, setEnd] = useState(new Date(endDate));
  const [totaldays, setTotaldays] = useState(0);

  const [productItems, setProductItems] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  


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
        hour12: true,
      };

      const formattedDate = date.toLocaleString(undefined, options);
      return <span>{formattedDate}</span>;
    } else {
      return <span>Invalid Date</span>;
    }
  }

  // Function to filter data based on globalFilter value
  const filteredData = useMemo(() => {
    return (productItems || []).filter((item) => {
      const productName = (item.product?.product_name || "").toLowerCase();
      const productId = (item.product?.id || "").toString();
      const date = (formattedDate(item.product?.created_at) || "").toString();

      const filterText = globalFilter ? globalFilter.trim().toLowerCase() : "";

      return (
        productName.includes(filterText) ||
        productId.includes(filterText) ||
        date.includes(filterText)
      );
    });
  }, [productItems, globalFilter]);

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });



 

 
  
  const isOrderEmpty = productItems.length === 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/Products/Products.php`
        );

        // Get the status code
        const statusCode = response.status;
        setStatusCode(statusCode);

        if (statusCode === 200) {
          const body = await response.json();

          setProductItems(body);
          // console.log(body);
        } else {
          // Handle non-200 status codes here
          console.error(`HTTP error! Status: ${statusCode}`);
        }
      } catch (error) {
        // Handle network errors here
        // console.error(error);
        toast.info(error, {
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

    fetchData();
  }, []);

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const router = useRouter();
  // handleClick to view project single page
  const handleClick = (project) => {
    router.push(`/projects/${project.id}`);
  };

  return (
   
    <>
    {filteredData.map((item) => (
        <React.Fragment key={item.product.id}>
    <Card>
    
      {/* header */}
      <header className="flex justify-between items-end">
        <div className="flex space-x-4 items-center rtl:space-x-reverse">
          <div className="flex-none">
            <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
              {item.product.product_name.charAt(0) + item.product.product_name.charAt(1)}
            </div>
          </div>
          <div className="font-medium text-base leading-6">
            <div className="dark:text-slate-200 text-slate-900 max-w-[160px] truncate">
            {item.product.product_name}
            </div>
          </div>
        </div>
        <div>
          <Dropdown
            classMenuItems=" w-[130px]"
            label={
              <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div>
              <Menu.Item onClick={() => handleClick(project)}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons:eye" />
                  </span>
                  <span>View</span>
                </div>
              </Menu.Item>
              <Menu.Item 
            //   onClick={() => dispatch(updateProject(project))}
              >
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons-outline:pencil-alt" />
                  </span>
                  <span>Edit</span>
                </div>
              </Menu.Item>
              <Menu.Item 
            //   onClick={() => dispatch(removeProject(project.id))}
              >
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons-outline:trash" />
                  </span>
                  <span>Delete</span>
                </div>
              </Menu.Item>
            </div>
          </Dropdown>
        </div>
      </header>
      <center>
      <div   className="h-[50%] w-[50%] rounded ring-1 ring-slate-100"
               >
                <img
                      className="w-full h-full rounded"
                            src={
                              item.product === null
                                ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                                : item.product.image
                            }
                            alt=""
                          />
              </div>
      </center>
       {/* name */}
      <div className="text-slate-600 dark:text-slate-200 text-lg pt-4 pb-8">
      {item.product.product_name}
      {/* description */}
      </div>
      <div className="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-8">
      {item.product.product_desc}
      </div>
      <div className="flex space-x-4 rtl:space-x-reverse">
      {/* Created Date */}
        <div>
          <span className="block date-label">Created Date</span>
          <span className="block date-text"> {formattedDate(item.product.created_at)}</span>
        </div>
      </div>
      {/* progress bar */}
      <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
      {item.product.discount}%
      </div>
      <ProgressBar value={item.product.discount} className="bg-primary-500" />
      {/* assignee and total date */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* assignee */}
        <div>
          <div className="text-slate-400 dark:text-slate-400 text-sm font-normal mb-3">
            Package ID :   {item.product.package_id}
          </div>
          <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
          
          <img src={ item.product === null
                     ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                    : item.product.image
                }
                  alt="product_img"
                  className="w-[50px] h-[50px] rounded-full"
                />
           
            <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 text-xs ring-2 ring-slate-100 dark:ring-slate-700 rounded-full h-6 w-6 flex flex-col justify-center items-center">
            {item.product.id}
            </div>
          </div>
        </div>

        {/* total date */}
        <div className="ltr:text-right rtl:text-left">
          <span className="inline-flex items-center space-x-1 bg-success-500 bg-opacity-[0.16] text-success-500 text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
            <span>
              {" "}
              <Icon icon="entypo:price-tag" />
            </span>
            <span>
            {naira.format(item.product.price)}
            </span>
            {/* <span>days left</span> */}
          </span>
        </div>
      </div>
    </Card>
      </React.Fragment>
   ))}
   </>
   
  );
};

export default ProductGrid;
