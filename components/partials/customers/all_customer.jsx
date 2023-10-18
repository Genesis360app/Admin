import React,{useEffect,useState,useMemo} from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GlobalFilter from "@/components/partials/table/GlobalFilter";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@/components/ui/Tooltip";
import axios from 'axios'; 
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';

const TransactionsTable = () => {

    
const router = useRouter();

// handleClick to view project single page
// const handleClick = (item) => {
//   router.push(`/kyc/${item.id}`);
// };

// handleClick to view project single page
const handleClick = (item) => {
  router.push(`/kyc`);
};

// handleClick to view transaction single page
const handleTnx = (item) => {
  router.push(`/transaction/${item.id}`);
};

  
    
  const [all_user, setAll_user] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Added pageSize state
  const itemsPerPage = pageSize; // Use pageSize for itemsPerPage
  const maxPageButtons = 5; // Number of page buttons to display
  const [globalFilter, setGlobalFilter] = useState(""); // Global filter



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
return (all_user || []).filter((item) => {
  const id = (item?.id|| "").toString(); // Access product_name safely and convert to lowercase
  const user_id = (item?.user_id || "").toString(); // Access package_id safely and convert to string
  const fname = (item?.first_name || "").toString(); // Access package_id safely and convert to string
  const lname = (item?.last_name || "").toString(); // Access package_id safely and convert to string
  const phone = (item?.phone || "").toString(); // Access package_id safely and convert to string
  const email = (item?.email || "").toString(); // Access package_id safely and convert to string


  // Check if globalFilter is defined and not null before using trim
  const filterText = globalFilter ? globalFilter.trim() : "";

  // Customize this logic to filter based on your specific requirements
  return (
    user_id.includes(filterText.toLowerCase()) ||
    id.includes(filterText)||
    email.includes(filterText)||
    phone.includes(filterText)||
    lname.includes(filterText)||
    fname.includes(filterText)
  );
});
}, [all_user, globalFilter]);





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


useEffect(() => {
    const fetchDatas = async () => {
      try {
        const token = localStorage.getItem('token');
  
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getAllUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.data) {
          // Handle error if the response data is not available
          toast.warning('Network response was not ok', {
            position: 'top-right',
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        
  
        console.log(response.data);
        if (response.data.code === 200) {
          // Handle successful response
          setAll_user(response.data.payload);
        } else if (response.data.code === 401) {
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      } catch (error) {
        // Handle errors here
        toast.error(error.message, {
          position: 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      }
    };
    
    // Call the asynchronous function
    fetchDatas(); 
  }, []);
  

  return (
    <>
    <ToastContainer/> 
 

      <Card noborder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">All Users Account</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>

        
        <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                  <tr >
                    <th scope="col" className="table-th">
                      ID
                    </th>
                    <th scope="col" className="table-th">
                    User ID
                    </th>
                    <th scope="col" className="table-th">
                    Avatar
                    </th>
                    <th scope="col" className="table-th">
                    Name
                    </th>
                    <th scope="col" className="table-th">
                    Email
                    </th>
                    <th scope="col" className="table-th">
                    Phone
                    </th>
                    <th scope="col" className="table-th">
                    Wallet Balance
                    </th>
                   
                    <th scope="col" className="table-th">
                    Partner
                    </th>
                    <th scope="col" className="table-th">
                    Business Status
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
                  <React.Fragment key={item.id}>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >

                      <tr >
                      <td className="table-td py-2"> <span>{item.id}</span></td>
                      <td className="table-td py-2"> <span>{item.user_id}</span></td>
                      <td className="table-td py-2"> <span> <img src={
                              item.avatar === ""
                                ? "https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg"
                                : item.avatar
                            } alt="avatar"
                      className="w-full h-full rounded-full"  />
                    </span></td>
                      <td className="table-td py-2"> <span>{item.first_name + " " + item.last_name }</span></td>
                      <td className="table-td py-2"> <span>{item.email}</span></td>
                      <td className="table-td py-2"> <span>{item.phone}</span></td>
                      <td className="table-td py-2"> <span>  
                      {item.wallet < 100 ?  (
                        <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
                        {item.wallet !== null ? naira.format(parseFloat(item.wallet)) : 'N/A'}
                     </div> 
                         ):(
                    <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-primary-500 bg-primary-500">
                    {item.wallet !== null ? naira.format(parseFloat(item.wallet)) : 'N/A'}
             
                        </div>
                    )}</span></td>

                      <td className="table-td py-2"> 
                {item.isBusiness == 1 ?  (
            <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
            Business
            </div> 
            ):(
              <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-pending-500 bg-pending-500">
              Customer
             
            </div>
            )}
              </td>
                      <td className="table-td py-2"> 
                 <span>
                {item.isBusiness == 1 ?  (
              <>
              {item.businessIsPartner == 1 ?  (
            <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-success-500 bg-success-500">
            Verified
            </div> 
            ):(
              <div className="inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-danger-500 bg-danger-500">
              Unverified
             
            </div>
            )}
             
            
              </>
            ):(

              ""
            )}
                      </span></td>
                      <td className="table-td py-2"> <span>{formattedDate(item.created_at)}</span></td>

                      <td className="table-td py-2">

                      <div className="flex space-x-3 rtl:space-x-reverse">
                            <Tooltip content="View" placement="top" arrow animation="shift-away">
                              <button className="action-btn" type="button" onClick={() => handleClick(item)}>
                                <Icon icon="heroicons:eye" />
                              </button>
                            </Tooltip>
                            <Tooltip content="transactions" placement="top" arrow animation="shift-away">
                              <button className="action-btn" type="button" onClick={() => handleTnx(item)}>
                                <Icon icon="tdesign:undertake-transaction" />
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
              <span>{currentPage} of {totalPages}</span>
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
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

export default TransactionsTable;
