"use client";

import React, { useState, useEffect,useRef, useMemo  } from "react";
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
import { productService } from "@/services/product.services";
import HTMLReactParser from "html-react-parser";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
import JoditEditor from 'jodit-react';

const ProductGrid = ({ project, globalFilter, placeholder }) => {
  const { startDate, endDate } = project;
  const [start, setStart] = useState(new Date(startDate));
  const [end, setEnd] = useState(new Date(endDate));
  const [totaldays, setTotaldays] = useState(0);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [productItems, setProductItems] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [edit_productModal, setEdit_productModal] = useState(false);
  const [merge_productModal, setMerge_productModal] = useState(false);
  const [delete_productModal, setDelete_productModal] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [image, setImage] = useState("");
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const editor = useRef(null);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
      const productName = (item?.name || "").toLowerCase(); // Access product_name safely and convert to lowercase
      const productPrice = (item?.price || "").toString(); // Access product_name safely and convert to lowercase
      const productDiscount = (item?.discount || "").toString(); // Access product_name safely and convert to lowercase
      const productId = (item?.id || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item?.dateCreated) || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        productName.includes(filterText.toLowerCase()) ||
        productPrice.includes(filterText) ||
        productDiscount.includes(filterText) ||
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
    const allProductData = async () => {
      try {
        const response = await productService.fetchAllProduct(); // Call fetchUsers as a function

        if (response) {
          // console.log(response.data); // Use response.data
          setProductItems(response.data);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    allProductData();
  }, []);

  const handleEditProduct = async () => {
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

        const editById = selectedEdit?.id;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("discount", discount);
        formData.append("countInStock", countInStock);

        // Append the image file if it exists
        if (files) {
            formData.append("image", files);
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/product/update_product/${editById}`,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                method: "PUT",
                body: formData,
            }
        );
        const responseData = await response.json();

        if (response.status === 200) {
          setSuccess("Product updated successfully");
            _notifySuccess("Product updated successfully");
            setShowRefreshButton(true);
            // setTimeout(() => {
            //     window.location.reload();
            // }, 4000);
        } else {
            setError(responseData.message);
        }
    } catch (error) {
        // console.error("Error during edit product:", error.message);
    } finally {
        setIsLoading(false);
    }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  

  // Set up the FileReader onload event handler
  reader.onload = () => {
    setSelectedImages(reader.result); // Set the selected image
  };

  // Read the file as a data URL
  if (file) {
    reader.readAsDataURL(file);
  }

  // Update the files state with the selected file
  setFiles(file);
};

const config = useMemo(() => ({
  readonly: false,
  placeholder: placeholder || 'Start typing...'
}), [placeholder]);

const handleDeleteProduct = async () => {
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
    const editById = selectedEdit?.id;
    // console.log(editById);
    // console.log(user.token);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/delete_product/${editById}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        method: "DELETE",
      }
    );
    const responseData = await response.json();

    if (response.status === 200) {
      _notifySuccess("Product deleted successfully");
      setSuccess(responseData.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      setError(responseData.message);
    }
  } catch (error) {
    // console.error("Error during edit product:", error.message);
  } finally {
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
        title={"Edit Product ID" + " "+ selectedEdit?.id}
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setEdit_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
        {success ? (
              <Alert label={success} className="alert-success light-mode w-full " />
            ) : (
              ""
            )}
          <Textinput
            name="name"
            label="Product Name"
            placeholder="Product Name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
            defaultValue={selectedEdit?.name}
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
              defaultValue={selectedEdit?.price}
            />
            <Textinput
              name="discount"
              label="Discounted Price (Optional)"
              placeholder="# 1,800"
              required
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
              defaultValue={selectedEdit?.discount}
            />
          </div>
          <div>
            <div className="relative">
              <Textinput
                name="image"
                label="Image URL"
                type="file"
                placeholder="Image"
                required
                accept="image/*"
                onChange={handleImageChange}
                // defaultValue={selectedEdit?.image}
              />
              <div className="overlay absolute right-0 top-0 w-[30px] h-[30px] z-[-1]">
                {selectedImages && (
                  <img
                    src={selectedImages}
                    alt="Selected"
                    className="ml-auto block"
                  />
                )}
              </div>

              {selectedImages && (
        <img src={selectedImages} alt="Selected" className="block mt-2 w-[full] h-[fit]" />
      )}
            </div>
          </div>

          <JoditEditor
        ref={editor}
			defaultValue={selectedEdit?.description}
			config={config}
			// tabIndex={1} // tabIndex of textarea
      onBlur={(newContent) => setDescription(newContent)}// preferred to use only this option to update the content for performance reasons
      onChange={(newContent) => setDescription(newContent)} 
          />
            
            <Textinput
              name="countInStock"
              label="count In Stock"
              placeholder="countInStock (20 product)"
              required
              onChange={(e) => {
                setCountInStock(e.target.value);
              }}
              defaultValue={selectedEdit?.countInStock}
            />
          <div className="flex ltr:text-right rtl:text-left space-x-1">
            <Button
              className="btn btn-dark   text-center"
              onClick={handleEditProduct}
              disabled={ isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Add Product"
              )}
            </Button>
            {error ? (
              <Alert label={error} className="alert-danger light-mode w-fit " />
            ) : (
              ""
            )}
            
            {success ? (
              <Alert label={success} className="alert-success light-mode w-fit " />
            ) : (
              ""
            )}
            
            {showRefreshButton && (
    <Button
        className="btn btn-dark  text-center"
        onClick={() => window.location.reload()}
    >
    <div className="flex flex-auto gap-2 items-center">
      <p>Refresh</p>
         <Icon icon="material-symbols:refresh" />
    </div>
    </Button>
            )}
          </div>
        </form>
      </Modal>

      <Modal
        activeModal={delete_productModal}
        onClose={() => setDelete_productModal(false)}
        
        centered
        title={"Delete Product ID" + " " + selectedEdit?.id}
        footer={
          <Button
            text="Close"
            btnClass="btn-danger"
            onClick={() => setDelete_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          <center>

                  <img
                    src={
                      selectedEdit === null
                        ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                        : selectedEdit?.image
                    }
                    alt="product_img"
                    className="w-[150px] h-[150px] rounded-md "
                  />
                  
                  <div className="text-slate-600 dark:text-slate-200 text-lg pt-4 pb-1">
              <p className="font-bold">Are you sure you want to Delete ?</p>
            </div>
                  <div className="text-slate-600 dark:text-slate-200 text-lg pb-1">
              {selectedEdit?.name}
            </div>
            {error ? (
              <Alert 
              label={error}
               className="alert-danger light-mode w-fit " />
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
            <br/>

            <div className="flex ltr:text-right rtl:text-left space-x-2 justify-center">
              <Button
                className="btn btn-dark  text-center"
                onClick={() => setMerge_productModal(false)}
              >
                  Cancel
              </Button>

              <Button
                className="btn btn-danger  text-center"
                onClick={handleDeleteProduct}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Delete Product"
                )}
              </Button>
            </div>
          </center>
        </form>
      </Modal>

      {filteredData.map((item) => (
        <React.Fragment key={item?.id}>
          <Card>
            {/* header */}
            <header className="flex justify-between items-end">
              <div className="flex space-x-4 items-center rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                    {item?.name.charAt(0) +
                      item?.name.charAt(1)}
                  </div>
                </div>
                <div className="font-medium text-base leading-6">
                  <div className="dark:text-slate-200 text-slate-900 max-w-[160px] truncate">
                    {item?.name}
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
                       onClick={() => {
                        setSelectedEdit(item);
                        setDelete_productModal(true);
                      }}
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
                    item === null
                      ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                      : item?.image
                  }
                  alt=""
                />
              </div>
            </center>
            {/* name */}
            <div className="text-slate-600 dark:text-slate-200 text-lg pt-4 pb-8">
              {item?.name}
              {/* description */}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-8">
              {HTMLReactParser(item?.description)}
            </div>
            <div className="flex space-x-4 rtl:space-x-reverse">
              {/* Created Date */}
              <div>
                <span className="block date-label">Created Date</span>
                <span className="block date-text">
                  {" "}
                  {formattedDate(item?.dateCreated)}
                </span>
              </div>
            </div>
            {/* progress bar */}
            <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
              {naira.format(item?.price)}
            </div>
            <ProgressBar
              value={item?.countInStock}
              className="bg-primary-500"
            />
            {/* assignee and total date */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* assignee */}
              <div>
                <div className="text-slate-400 dark:text-slate-400 text-sm font-normal mb-3">
                CountInStock : {item?.countInStock}
                </div>
                <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
                  <img
                    src={
                      item === null
                        ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                        : item?.image
                    }
                    alt="product_img"
                    className="w-[50px] h-[50px] rounded-full"
                  />

                  <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 text-xs ring-2 ring-slate-100 dark:ring-slate-700 rounded-full h-6 w-6 flex flex-col justify-center items-center">
                  {item?.id.slice(0, 5)}...{item.id.slice(-10)}
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
                  
                  {item.discount > 0 ? (
                    <span> {naira.format(item?.discount)}</span>
                    ) : (
                      <span> {naira.format(item?.price)}</span>
                    )}
                 
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
