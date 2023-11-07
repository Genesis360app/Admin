"use client";
import React, { useEffect, useState, useRef } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PackagePage = () => {
  const [check, setCheck] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const toggle = () => {
    setCheck(!check);
  };
  const [all_packages, setAll_packages] = useState([]);
  const [statusCode, setStatusCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/Products/Packages.php`
        );

        // Get the status code
        const statusCode = response.status;
        setStatusCode(statusCode);

        if (statusCode === 200) {
          const body = await response.json();

          setAll_packages(body);
          //   console.log(body);
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

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  // Map all_packages to tables format
  const tables = all_packages.map((packageItem, i) => {
    const id = packageItem.details.id;
    const package_name = packageItem.details.package_name;
    const package_description = packageItem.details.package_description;
    const value = packageItem.value;
    const created_at = packageItem.details.created_at;

    // Initialize bg and img with default values
    let bg = "bg-success-500";
    let img = "/assets/images/all-img/big-shap3.png";

    // Set bg and img based on id
    if (id == 1) {
      bg = "bg-warning-500";
      img = "/assets/images/all-img/big-shap1.png";
    } else if (id == 3) {
      bg = "bg-info-500";
      img = "/assets/images/all-img/big-shap2.png";
    } else if (id == 4) {
      bg = "bg-success-500";
      img = "/assets/images/all-img/big-shap3.png";
    } else if (id == 5) {
      bg = "bg-primary-500";
      img = "/assets/images/all-img/big-shap4.png";
    } else if (id == 6) {
      bg = "bg-secondary-500";
      img = "/assets/images/all-img/big-shap4.png";
    }

    // Return an object with the desired properties
    return {
      id,
      title: package_name,
      price: value,
      date: created_at,
      description: package_description,
      button: package_name,
      bg,
      img,
    };
  });

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h4 className="text-slate-900 text-xl font-medium">Packages</h4>
        <label className="inline-flex text-sm cursor-pointer">
          <input type="checkbox" onChange={toggle} hidden />
          <span
            className={` ${
              check
                ? "bg-slate-900 dark:bg-slate-900 text-white"
                : "dark:text-slate-300"
            } 
                px-[18px] py-1 transition duration-100 rounded`}
          >
            <Button
              text="Add Package"
              className="btn-outline-dark dark:border-slate-400 w-full"
            />
          </span>
          <span
            className={`
              ${
                !check
                  ? "bg-slate-900 dark:bg-slate-900 text-white"
                  : " dark:text-slate-300"
              }
                px-[18px] py-1 transition duration-100 rounded
                `}
          >
            <Button
              text="Edit Package"
              className="btn-outline-dark dark:border-slate-400 w-full"
            />
          </span>
        </label>
      </div>
      <div className="space-y-5">
        <Card>
          <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {tables.map((item, i) => (
              <div
                className={` ${item.bg}
          price-table bg-opacity-[0.16] dark:bg-opacity-[0.36] rounded-[6px] p-6 text-slate-900 dark:text-white relative overflow-hidden z-[1]
          `}
                key={i}
              >
                <div className="overlay absolute right-0 top-0 w-full h-full z-[-1]">
                  <img src={item.img} alt="" className="ml-auto block" />
                </div>
                {item.ribon && (
                  <div className="text-sm font-medium bg-slate-900 dark:bg-slate-900 text-white py-2 text-center absolute ltr:-right-[43px] rtl:-left-[43px] top-6 px-10 transform ltr:rotate-[45deg] rtl:-rotate-45">
                    {item.ribon}
                  </div>
                )}
                <header className="mb-6">
                  <h4 className="text-xl mb-5">{item.title}</h4>
                  <div className="space-x-4 relative flex items-center mb-5 rtl:space-x-reverse">
                    <span className="text-[32px] leading-10 font-medium">
                      {naira.format(item.price)}
                    </span>

                    <span className="text-xs text-warning-500 font-medium px-3 py-1 rounded-full inline-block bg-white uppercase h-auto">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-300 text-sm">
                    {item.date}
                  </p>
                </header>
                <div className="price-body space-y-8">
                  <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                  <div>
                    <Button
                      text={item.button}
                      onClick={() => {
                        setSelectedCardId(item.id);
                        setShowTable(!showTable); // Ensure showTable is set to true
                      }}
                      className="btn-outline-dark dark:border-slate-400 w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Table content */}
        {showTable && selectedCardId !== null && (
          <div className="col-span-2">
            <div className="-mx-6 overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
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
                          Payment Channel
                        </th>
                        <th scope="col" className="table-th">
                          Qty
                        </th>
                        <th scope="col" className="table-th">
                          Status
                        </th>
                        <th scope="col" className="table-th">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      {all_packages
                        .filter((item) => item.id === selectedCardId)
                        .map((item) => (
                          <tr key={item.products?.id}>
                            <td className="table-td py-2">
                              {" "}
                              {item.products?.id}{" "}
                            </td>
                            {/* Add other table columns here */}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackagePage;
