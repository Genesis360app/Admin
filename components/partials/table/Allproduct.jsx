"use client";

import React, { useState, useEffect } from "react";
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
import GlobalFilter from "./GlobalFilter";
import { InfinitySpin } from "react-loader-spinner";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Alert from "@/components/ui/Alert";
import Select from "react-select";

const ProductPostPage = () => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [all_packages, setAll_packages] = useState([]);
  const [productItems, setProductItems] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(""); // Define global filter state
  const [add_productModal, setAdd_productModal] = useState(false);
  const [edit_productModal, setEdit_productModal] = useState(false);
  const [product_name, setProduct_name] = useState("");
  const [product_id, setProduct_id] = useState("");
  const [price, setPrice] = useState("");
  const [product_desc, setProduct_desc] = useState("");
  const [discount, setDiscount] = useState("");
  const [package_id, setPackage_id] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusCode, setStatusCode] = useState(null);

  const { projects } = useSelector((state) => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoaded(true);
    setTimeout(() => {
      setIsLoaded(false);
    }, 1500);
  }, [filler]);

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

    const fetchProduct = async () => {
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
    fetchProduct();
  }, []);
  const handleAddProduct = async () => {
    var token = localStorage.getItem("token");
    var payload = new FormData();
    payload.append("product_name", product_name);
    payload.append("price", price);
    payload.append("product_desc", product_desc);
    payload.append("discount", discount);
    payload.append("package_id", package_id);
    payload.append("image", image);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Products/addProducts.php`,
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
          <Textinput
            name="title"
            label="Product Name"
            placeholder="Product Name"
            required
            onChange={(e) => {
              setProduct_name(e.target.value);
            }}
            value={product_name}
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
              placeholder="Calculated in %"
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
                placeholder="https://******.png"
                required
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                value={image}
              />
              <div className="overlay absolute right-0 top-0 w-[30px] h-[30px] z-[-1]">
                {image && (
                  <img
                    src={image}
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
                value={package_id}
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
            value={product_desc}
          />

          <div className="flex ltr:text-right rtl:text-left space-x-2">
            <Button
              className="btn btn-dark  text-center"
              onClick={handleAddProduct}
              disabled={
                !product_name ||
                !product_desc ||
                !price ||
                !package_id ||
                discount ||
                !image ||
                isLoading
              }
            >
              {isLoading ? (
                <center>
                  <InfinitySpin width="40" color="#00b09b" />
                </center>
              ) : (
                "Add Product"
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
            placeholder="Product Name"
            required
            onChange={(e) => {
              setProduct_name(e.target.value);
            }}
            value={product_name}
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
              placeholder="Calculated in %"
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
                placeholder="https://******.png"
                required
                onChange={(e) => {
                  setImage(e.target.value);
                }}
                value={image}
              />
              <div className="overlay absolute right-0 top-0 w-[30px] h-[30px] z-[-1]">
                {image && (
                  <img
                    src={image}
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
                value={package_id}
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
            value={product_desc}
          />

          {/* <div className="mt-[30px]">
  <label
    htmlFor="Package ID"
    className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"     
  >
Product ID
  </label>
  <select
    id="product_id"
    name="product_id"
    required
    onChange={(e) => {
     setProduct_id(e.target.value);}}
      value={product_id}
    className="form-control py-2  appearance-none"
  >
    <option value="">Select Product</option>
    {productItems.map((option) => (
      <>
      <option key={option.product.id} value={option.product.id}>
        {option.product.product_name}
      </option>
      
      </>
    ))}
  </select>
  
</div> */}

          <Textinput
            label="Product ID"
            placeholder="product_id"
            id="product_id"
            name="product_id"
            required
            onChange={(e) => {
              setProduct_id(e.target.value);
            }}
            value={product_id}
          />

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

      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          All Products Item
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
            onClick={() => {
              setEdit_productModal(true);
            }}
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
