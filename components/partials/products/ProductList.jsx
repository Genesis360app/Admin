import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import GlobalFilter from "../table/GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import { InfinitySpin } from "react-loader-spinner";
import Textarea from "@/components/ui/Textarea";
import Alert from "@/components/ui/Alert";
import Select from "react-select";
import Button from "@/components/ui/Button";
import axios from "axios";

const ProductList = ({ title = "All Product" }) => {
  const [productItems, setProductItems] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
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
    return (productItems || []).filter((item) => {
      const productName = (item.product?.product_name || "").toLowerCase(); // Access product_name safely and convert to lowercase
      const productId = (item.product?.id || "").toString(); // Access package_id safely and convert to string
      const date = (formattedDate(item.product?.created_at) || "").toString(); // Access package_id safely and convert to string

      // Check if globalFilter is defined and not null before using trim
      const filterText = globalFilter ? globalFilter.trim() : "";

      // Customize this logic to filter based on your specific requirements
      return (
        productName.includes(filterText.toLowerCase()) ||
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
  return (
    <>
      <ToastContainer />

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

      <Card>
        <div className="items-center justify-between mb-6 md:flex">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                      Package ID
                    </th>
                    <th scope="col" className="table-th">
                      Product Description
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
                  <React.Fragment key={item.product.id}>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      <tr>
                        <td className="table-td">{item.product.id}</td>
                        <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                          <img
                            className="w-20 h-20 rounded"
                            src={
                              item.product === null
                                ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                                : item.product.image
                            }
                            width={70}
                            height={70}
                            alt=""
                          />
                        </td>
                        <td className="table-td">
                          {item.product.product_name}
                        </td>
                        <td className="table-td">
                          {naira.format(item.product.price)}
                        </td>
                        <td className="table-td">{item.product.package_id}</td>
                        <td className="table-td">
                          {item.product.product_desc}
                        </td>
                        <td className="table-td">
                          {formattedDate(item.product.created_at)}
                        </td>
                        <td className="table-td">
                          <div className="flex space-x-3 rtl:space-x-reverse">
                            <Tooltip
                              content="Merge"
                              placement="top"
                              arrow
                              animation="shift-away"
                            >
                              <button
                                className="action-btn"
                                type="button"
                                onClick={() => {
                                  setSelectedEdit(item);
                                  setMerge_productModal(true);
                                }}
                              >
                                <Icon icon="heroicons:eye" />
                              </button>
                            </Tooltip>
                            <Tooltip
                              content="Edit"
                              placement="top"
                              arrow
                              animation="shift-away"
                            >
                              <button
                                className="action-btn"
                                type="button"
                                onClick={() => {
                                  setSelectedEdit(item);
                                  setEdit_productModal(true);
                                }}
                              >
                                <Icon icon="heroicons:pencil-square" />
                              </button>
                            </Tooltip>
                            <Tooltip
                              content="Delete"
                              placement="top"
                              arrow
                              animation="shift-away"
                              theme="danger"
                            >
                              <button
                                className="action-btn"
                                type="button"
                                onClick={() =>
                                  handleDeleteProduct(item.product.id)
                                }
                                disabled={isLoading}
                              >
                                <Icon icon="heroicons:trash" />
                              </button>
                            </Tooltip>
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
      </Card>
    </>
  );
};

export default ProductList;
