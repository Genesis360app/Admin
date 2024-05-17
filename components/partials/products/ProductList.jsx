import React, { useState, useEffect, useRef, useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import GlobalFilter from "../table/GlobalFilter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "@/components/ui/Modal";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import axios from "axios";
import { productService } from "@/services/product.services";
import HTMLReactParser from "html-react-parser";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
// import JoditEditor from "jodit-react";
import Fileinput from "@/components/ui/Fileinput";

const ProductList = ({ title = "All Product", placeholder }) => {
  const [productItems, setProductItems] = useState([]);
  const [statusCode, setStatusCode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Added pageSize state
  const [paginatedHistory, setpaginatedHistory] = useState([])
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter
  const [edit_productModal, setEdit_productModal] = useState(false);
  const [merge_productModal, setMerge_productModal] = useState(false);
  const [delete_productModal, setDelete_productModal] = useState(false);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [price, setPrice] = useState(selectedEdit?.price);
  const [discount, setDiscount] = useState(selectedEdit?.discount);
  const [image, setImage] = useState("");
  const [files, setFiles] = useState([]);
  const [name, setName] = useState(selectedEdit?.name);
  const [description, setDescription] = useState(selectedEdit?.description);
  const [countInStock, setCountInStock] = useState(selectedEdit?.countInStock);
  const [selectedImages, setSelectedImages] = useState([]);
  // const editor = useRef(null);
  const [all_packages, setAll_packages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [selectedFiles2, setSelectedFiles2] = useState([]);
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
  console.log(selectedEdit)
  useEffect(()=>{
    setName(selectedEdit?.name);
    setCountInStock(selectedEdit?.countInStock)
    setDescription(selectedEdit?.description)
    setDiscount(selectedEdit?.discount)
    setPrice(selectedEdit?.price)
    setSelectedImages(selectedEdit?.image)
  },[selectedEdit])

  // Function to filter data based on globalFilter value
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
  useEffect(()=>{
    setpaginatedHistory(filteredData.slice(startIndex, endIndex))
  },[filteredData])
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
      console.error("Error during edit product:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    // Set up the FileReader onload event handler
    reader.onload = () => {
      setSelectedImages(file); // Set the selected image
    };

    // Read the file as a data URL
    if (file) {
      reader.readAsDataURL(file);
    }

    // Update the files state with the selected file
    setFiles(file);
  };

  const handleFileChangeMultiple2 = (e) => {
    const files = e.target.files;
    const filesArray = Array.from(files).map((file) => file);
    setSelectedFiles2(filesArray);
  };

  // const config = useMemo(
  //   () => ({
  //     readonly: false,
  //     placeholder: placeholder || "Start typing...",
  //   }),
  //   [placeholder]
  // );

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
      //       console.log(user.token);

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
  return (
    <>
      <ToastContainer />

      <Modal
        activeModal={edit_productModal}
        onClose={() => setEdit_productModal(false)}
        title={"Edit Product ID" + " " + selectedEdit?.id}
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
                <img
                  src={selectedImages}
                  alt="Selected"
                  className="block mt-2 w-[full] h-[fit]"
                />
              )}
            </div>
          </div>

          <Textinput
          label="Product Description"
          id="description"
          type="text"
          defaultValue={selectedEdit?.description}
          placeholder="Product Description"
          onChange={(e) => {
              setDescription(e.target.value);
            }}
        />

          {/* <JoditEditor
            // ref={editor}
            defaultValue={selectedEdit?.description}
            // config={config}
            // tabIndex={1} // tabIndex of textarea
            onBlur={(newContent) => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
            onChange={(newContent) => setDescription(newContent)}
          /> */}

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
              disabled={isLoading}
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
              <Alert
                label={success}
                className="alert-success light-mode w-fit "
              />
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
              <Alert label={error} className="alert-danger light-mode w-fit " />
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
            <br />

            <div className="flex ltr:text-right rtl:text-left space-x-2 justify-center">
              <Button
                className="btn btn-dark  text-center"
                onClick={() => setDelete_productModal(false)}
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
      <Modal
        activeModal={merge_productModal}
        onClose={() => setMerge_productModal(false)}
        centered
        title={"Add Multiple Images"}
        footer={
          <Button
            text="Close"
            btnClass="btn-danger"
            onClick={() => setMerge_productModal(false)}
          />
        }
      >
        <form className="space-y-4 ">
          <Card title={selectedEdit?.name}>
            <Fileinput
              name="basic"
              selectedFiles={selectedFiles2}
              onChange={handleFileChangeMultiple2}
              multiple
              preview
            />
<br/>
<center>
 {selectedFiles2 ? (
              <>
                <Button
                  className="btn btn-dark  text-center"
                  onClick={() => setMerge_productModal(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              ""
            )}

</center>
           
          </Card>
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
                      Discount
                    </th>
                    <th scope="col" className="table-th">
                      CountInStock
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
                  <React.Fragment key={item?.id}>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      <tr>
                        <td className="table-td">
                          {" "}
                          {item?.id.slice(0, 5)}...{item.id.slice(-10)}
                        </td>
                        <td className="w-8 h-8 rounded-[100%] ltr:mr-2 rtl:ml-2">
                          <img
                            className="w-20 h-20 rounded"
                            src={
                              item === null
                                ? "https://www.pngkey.com/png/full/233-2332677_image-500580-placeholder-transparent.png"
                                : item?.image
                            }
                            width={70}
                            height={70}
                            alt=""
                          />
                        </td>
                        <td className="table-td">{item?.name}</td>
                        <td className="table-td">
                          {naira.format(item?.price)}
                        </td>

                        <td className="table-td">
                          {item.discount > 0 ? (
                            <>
                              <p className="text-green text-[30px] md:text-[16px] md:mt-2 font-bold">
                                {naira.format(item.discount)}
                              </p>
                              <p className="text-danger-600 line-through text-[18px] mt-3 md:text-[12px] font-bold ">
                                {naira.format(item.price)}
                              </p>
                            </>
                          ) : (
                            <p className="text-green text-[30px] md:text-[16px] md:mt-2 font-bold">
                              {naira.format(item.price)}
                            </p>
                          )}
                        </td>

                        <td className="table-td">{item?.countInStock}</td>
                        <td className="table-td">
                          {" "}
                          {item?.package_id.slice(0, 5)}...
                          {item.package_id.slice(-10)}
                        </td>
                        <td className="table-td">
                          {HTMLReactParser(item?.description)}
                        </td>
                        <td className="table-td">
                          {formattedDate(item?.dateCreated)}
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
                                onClick={() => {
                                  setSelectedEdit(item);
                                  setDelete_productModal(true);
                                }}
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
