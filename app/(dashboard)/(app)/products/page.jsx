"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import ProductGrid from "@/components/partials/products/productGrid";
import ProductList from "@/components/partials/products/ProductList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import Modal from "@/components/ui/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import Textinput from "@/components/ui/Textinput";
import Alert from "@/components/ui/Alert";
import { orderService } from "@/services/order.services";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
import JoditEditor from "jodit-react";

const ProductPostPage = ({ placeholder }) => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [add_productModal, setAdd_productModal] = useState(false);
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
  const { projects } = useSelector((state) => state.project);
  const dispatch = useDispatch();
  const [showRefreshButton, setShowRefreshButton] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
  }, [filler]);

  const handleAddProduct = async () => {
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
      // console.log(user.userId);
      // console.log(user.token);
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/product/add_products`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          method: "POST",
          body: formData,
        }
      );
      // console.log(name);
      // console.log(description);
      // console.log(price);
      // console.log(discount);
      // console.log(countInStock);
      // console.log(files);
      const responseData = await response.json();
      if (response.status == 201) {
        setSuccess("Product Added successfully");
        _notifySuccess("Product Added successfully");
        setTimeout(() => {
          window.location.reload();
        }, 4000);
      }
      setError(responseData.message);
    } catch (error) {
      // console.error("Error during onSuccess:", error.message);
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

  useEffect(() => {
    const productCountData = async () => {
      try {
        const response = await orderService.totalProduct(); // Call fetchUsers as a function

        if (response) {
          // console.log(response); // Use response.data
          setTotalProduct(response.productCount);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    productCountData();
  }, []);

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder]
  );

  return (
    <div>
      <ToastContainer />
      {/* add product */}
      <Modal
        activeModal={add_productModal}
        onClose={() => setAdd_productModal(false)}
        title="Add Product"
        footer={
          <Button
            text="Close"
            btnClass="btn-primary"
            onClick={() => setAdd_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          {success ? (
            <Alert
              label={success}
              className="alert-success light-mode w-full "
            />
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
            value={name}
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
              value={price}
            />
            <Textinput
              name="discount"
              label="Discounted Price (Optional)"
              placeholder="# 1,800"
              required
              onChange={(e) => {
                setDiscount(e.target.value);
              }}
              value={discount}
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
                value={image}
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
                <img
                  src={selectedImages}
                  alt="Selected"
                  className="block mt-2 w-[full] h-[fit]"
                />
              )}
            </div>
          </div>

          <JoditEditor
            ref={editor}
            value={description}
            config={config}
            // tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
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
            value={countInStock}
          />
          <div className="flex ltr:text-right rtl:text-left space-x-2">
            <Button
              className="btn btn-dark  text-center"
              onClick={handleAddProduct}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                "Add Product"
              )}
            </Button>
            {error ? (
              <Alert label={error} className="alert-danger light-mode w-4/6 " />
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

      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          All Product Items ({totalProduct})
        </h4>
        <div
          className={`${
            width < breakpoints.md ? "space-x-rb" : ""
          } md:flex md:space-x-4 md:justify-end items-center rtl:space-x-reverse`}
        >
          <Button
            icon="heroicons:list-bullet"
            text="List view"
            disabled={isLoaded}
            className={`${
              filler === "list"
                ? "bg-slate-900 dark:bg-slate-700  text-white"
                : " bg-white dark:bg-slate-800 dark:text-slate-300"
            }   h-min text-sm font-normal`}
            iconClass=" text-lg"
            onClick={() => setfiller("list")}
          />
          <Button
            icon="heroicons-outline:view-grid"
            text="Grid view"
            disabled={isLoaded}
            className={`${
              filler === "grid"
                ? "bg-slate-900 dark:bg-slate-700 text-white"
                : " bg-white dark:bg-slate-800 dark:text-slate-300"
            }   h-min text-sm font-normal`}
            iconClass=" text-lg"
            onClick={() => setfiller("grid")}
          />

          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

          {/* ... Existing code ... */}

          <Button
            icon="uil:edit"
            text="Edit Product"
            className="bg-white dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-900 hover:text-white btn-md  h-min text-sm font-normal"
            iconClass=" text-lg"
          />

          <Button
            icon="heroicons-outline:plus"
            text="Add Product"
            className="btn-dark dark:bg-slate-800  h-min text-sm font-normal"
            iconClass=" text-lg"
            onClick={() => {
              setAdd_productModal(true);
            }}
          />
        </div>
      </div>
      {isLoaded && filler === "grid" && (
        <GridLoading count={projects?.length} />
      )}
      {isLoaded && filler === "list" && (
        <TableLoading count={projects?.length} />
      )}

      {filler === "grid" && !isLoaded && (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {projects.map((project, projectIndex) => (
            <ProductGrid
              globalFilter={filler === "grid" ? globalFilter : ""}
              project={project}
              key={projectIndex}
            />
          ))}
        </div>
      )}
      {filler === "list" && !isLoaded && (
        <div>
          <ProductList projects={projects} />
        </div>
      )}
    </div>
  );
};

export default ProductPostPage;
