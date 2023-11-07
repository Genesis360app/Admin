"use client";

import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import ProgressBar from "@/components/ui/ProgressBar";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Modal from "@/components/ui/Modal";
import { InfinitySpin } from "react-loader-spinner";
import Textarea from "@/components/ui/Textarea";
import Alert from "@/components/ui/Alert";
// import Select from 'react-select';
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";

const ProductGrid = ({ project, globalFilter }) => {
  const { startDate, endDate } = project;
  const dispatch = useDispatch();

  const [start, setStart] = useState(new Date(startDate));
  const [end, setEnd] = useState(new Date(endDate));
  const [totaldays, setTotaldays] = useState(0);

  const [productItems, setProductItems] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [edit_productModal, setEdit_productModal] = useState(false);
  const [merge_productModal, setMerge_productModal] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [product_name, setProduct_name] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [price, setPrice] = useState("");
  const [product_desc, setProduct_desc] = useState("");
  const [discount, setDiscount] = useState("");
  const [package_id, setPackage_id] = useState("");
  const [image, setImage] = useState("");
  const [all_packages, setAll_packages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    const fetchPackage = async () => {
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
    fetchPackage();
    fetchData();
  }, []);

  const handleEditProduct = async () => {
    var token = localStorage.getItem("token");
    var payload = new FormData();
    payload.append("product_name", product_name);
    payload.append("price", price);
    payload.append("product_desc", product_desc);
    payload.append("discount", discount);
    payload.append("package_id", package_id);
    payload.append("image", image);
    payload.append("product_id", product_id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Products/updateProduct.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();
      toast.success(data.message, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setIsLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      // Handle errors, maybe show an error message
      setError("An error occurred while uploading product.");
      toast.error("An error occurred while uploading product.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  const handleMergeProduct = async () => {
    var token = localStorage.getItem("token");
    var payload = new FormData();
    payload.append("package_id", package_id);
    payload.append("product_id", product_id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Products/attachProduct.php`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: payload,
        }
      );

      const data = await response.json();
      toast.success("Product Merge Successfully with Package", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setIsLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      // Handle errors, maybe show an error message
      setError("An error occurred while uploading product.");
      toast.error("An error occurred while uploading product.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (product_id) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token"); // Replace with your authentication method
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const body = {
        id: product_id, // Use the itemId parameter here
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Products/deleteProduct.php`,

        body,
        { headers, cache: "no-store" }
      );

      // Handle the response as needed
      // console.log(response.data);
      if (response.status === 200) {
        // Handle a successful response here
        toast.success("product deleted successfully", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        setIsLoading(false);
      } else if (response.status === 401) {
        // Handle unauthorized access
      } else {
        // Handle other status codes or errors
      }
    } catch (error) {
      setError("An error occurred while updating the order status.");

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
      setIsLoading(false);
    }
  };

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
      <Modal
        activeModal={edit_productModal}
        onClose={() => setEdit_productModal(false)}
        title="Edit Product"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setEdit_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          <Textinput
            name="title"
            label="Product Name"
            required
            onChange={(e) => {
              setProduct_name(e.target.value);
            }}
            // value={product_name}

            defaultValue={
              selectedEdit && selectedEdit.product
                ? selectedEdit.product.product_name
                : ""
            }
          />

          <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <Textinput
              name="price"
              label="Price"
              placeholder="# 2,000"
              required
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              // value={price}
              defaultValue={
                selectedEdit && selectedEdit.product
                  ? selectedEdit.product.price
                  : ""
              }
            />
            <Textinput
              name="discount"
              label="Discounted Price (Optional)"
              placeholder="Calculated in %"
              required
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
              defaultValue={
                selectedEdit && selectedEdit.product
                  ? selectedEdit.product.discount
                  : ""
              }
            />
          </div>
          <div>
            <div className="relative">
              <Textinput
                name="image"
                label="Image URL"
                placeholder="https://******.png"
                required
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                defaultValue={
                  selectedEdit &&
                  selectedEdit.product &&
                  selectedEdit.product.image
                    ? selectedEdit.product.image
                    : ""
                }
              />
              <div className="overlay absolute right-0 top-0 w-[30px] h-[30px] z-[-1]">
                {selectedEdit &&
                  selectedEdit.product &&
                  selectedEdit.product.image && (
                    <img
                      src={selectedEdit.product.image}
                      alt="User provided"
                      className="ml-auto block"
                    />
                  )}
              </div>
            </div>
          </div>

          <div>
            <div className="mt-[30px]">
              <label
                htmlFor="Package ID"
                className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
              >
                Package ID
              </label>

              <select
                id="package_id"
                name="package_id"
                required
                onChange={(e) => {
                  setPackage_id(e.target.value);
                }}
                // value={package_id}
                defaultValue={
                  selectedEdit && selectedEdit.product
                    ? selectedEdit.product.package_id
                    : ""
                }
                className="form-control py-2  appearance-none"
              >
                <option value="">Select Package</option>
                {all_packages.map((option) => (
                  <option key={option.details.id} value={option.details.id}>
                    {option.details.package_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Textarea
            label="Description"
            placeholder="Product Description"
            onChange={(e) => {
              setProduct_desc(e.target.value);
            }}
            defaultValue={
              selectedEdit &&
              selectedEdit.product &&
              selectedEdit.product.product_desc
                ? selectedEdit.product.product_desc
                : ""
            }
          />

          <div className="mt-[30px]">
            <label
              htmlFor="Package ID"
              className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
            >
              Product ID
            </label>
            <Textinput
              name="product_id"
              placeholder="id"
              onChange={(e) => {
                setProduct_id(e.target.value);
              }}
              defaultValue={
                selectedEdit && selectedEdit.product
                  ? selectedEdit.product.id
                  : ""
              }
            />
          </div>

          <div className="flex ltr:text-right rtl:text-left space-x-2">
            <Button
              className="btn btn-dark  text-center"
              onClick={handleEditProduct}
              disabled={isLoading}
            >
              {isLoading ? (
                <center>
                  <InfinitySpin width="40" color="#00b09b" />
                </center>
              ) : (
                "Update Product"
              )}
            </Button>
            {error ? (
              <Alert label={error} className="alert-danger light-mode w-4/6 " />
            ) : (
              ""
            )}
          </div>
        </form>
      </Modal>

      <Modal
        activeModal={merge_productModal}
        onClose={() => setMerge_productModal(false)}
        title="Edit Product"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setMerge_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          <div>
            <div className="mt-[30px]">
              <label
                htmlFor="Package ID"
                className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
              >
                Package ID
              </label>
              <select
                id="package_id"
                name="package_id"
                required
                onChange={(e) => {
                  setPackage_id(e.target.value);
                }}
                // value={package_id}
                defaultValue={
                  selectedEdit && selectedEdit.product
                    ? selectedEdit.product.package_id
                    : ""
                }
                className="form-control py-2  appearance-none"
              >
                <option value="">Select Package</option>
                {all_packages.map((option) => (
                  <option key={option.details.id} value={option.details.id}>
                    {option.details.package_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-[30px]">
            <label
              htmlFor="Package ID"
              className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
            >
              Product ID
            </label>
            <Textinput
              name="product_id"
              placeholder="id"
              onChange={(e) => {
                setProduct_id(e.target.value);
              }}
              defaultValue={
                selectedEdit && selectedEdit.product
                  ? selectedEdit.product.id
                  : ""
              }
            />
          </div>

          <div className="flex ltr:text-right rtl:text-left space-x-2">
            <Button
              className="btn btn-dark  text-center"
              onClick={handleMergeProduct}
              disabled={isLoading}
            >
              {isLoading ? (
                <center>
                  <InfinitySpin width="40" color="#00b09b" />
                </center>
              ) : (
                "Merge Product"
              )}
            </Button>
            {error ? (
              <Alert label={error} className="alert-danger light-mode w-4/6 " />
            ) : (
              ""
            )}
          </div>
        </form>
      </Modal>

      {filteredData.map((item) => (
        <React.Fragment key={item.product.id}>
          <Card>
            {/* header */}
            <header className="flex justify-between items-end">
              <div className="flex space-x-4 items-center rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                    {item.product.product_name.charAt(0) +
                      item.product.product_name.charAt(1)}
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
                    <Menu.Item
                      onClick={() => {
                        setSelectedEdit(item);
                        setMerge_productModal(true);
                      }}
                    >
                      <div
                        className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                      >
                        <span className="text-base">
                          <Icon icon="heroicons:eye" />
                        </span>
                        <span>Merge</span>
                      </div>
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        setSelectedEdit(item);
                        setEdit_productModal(true);
                      }}
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
                      onClick={() => handleDeleteProduct(item.product.id)}
                      disabled={isLoading}
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
              <div className="h-[50%] w-[50%] rounded ring-1 ring-slate-100">
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
                <span className="block date-text">
                  {" "}
                  {formattedDate(item.product.created_at)}
                </span>
              </div>
            </div>
            {/* progress bar */}
            <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
              {item.product.discount}%
            </div>
            <ProgressBar
              value={item.product.discount}
              className="bg-primary-500"
            />
            {/* assignee and total date */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* assignee */}
              <div>
                <div className="text-slate-400 dark:text-slate-400 text-sm font-normal mb-3">
                  Package ID : {item.product.package_id}
                </div>
                <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
                  <img
                    src={
                      item.product === null
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
                  <span>{naira.format(item.product.price)}</span>
                  {/* <span>days left</span> */}
                </span>
              </div>
            </div>
          </Card>
        </React.Fragment>
      ))}
      <ToastContainer />
    </>
  );
};

export default ProductGrid;
