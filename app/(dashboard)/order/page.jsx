"use client";
import React,{useEffect,useState,Fragment,useRef} from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import axios from 'axios';
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";

const OrderPage = () => {

  const getStatus = (status ) => {
    switch (status) {
     case 1:
       return "pending";
     case 2:
       return "Paid";
     case 3:
       return "Processing";
     case 4:
       return "in-transit";
     case 5:
       return "delivering";
     case 6:
       return "complete";
     default:
       return "";
    }
  
   }

  // const router = useRouter();
  // const routerId = router.query.id;
  const [status_, setStatus_] = useState(0);
  const orderStatus = getStatus(status_);
  const steps = ["pending", "Paid", "Processing", "in-transit", "delivering", "complete"];
  const statusIndex = steps.indexOf(orderStatus);
  const [cartItems, setCartItems] = useState([]);
  const [priceTotal, setPriceTotal] = useState(0);
  const [orderid, setOrderid ]= useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [houseNumber, setHouseNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [landmark, setLandmark] = useState("");
  const [town, setTown] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [date, setDate] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [address, setAddress] = useState("");
  const [useridref, setUseridref] = useState("");

  const getDatePlus = (date ) => {
    var now =  new Date(date);
    var newDay = now.setDate(now.getDate() + 2);
    var delDate = new Date(newDay);
    return delDate.toString();
  }

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

const last25Items = cartItems;

// Sort the last 25 items by the 'id' property in ascending order
last25Items.sort((a, b) => {
  const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
  const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

  return idB - idA; // Sort in ascending order by 'id'
});

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

    useEffect(() => {
       
        var userid = localStorage.getItem("userid");
        var id = localStorage.getItem("id");
        var token = localStorage.getItem("token");
    
        // fetch(`https://orangli.com/server/api/Products/orderById.php?orderid=${routerId}`, {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/orderById.php?orderid=246`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
        })
        .then(response => response.json())
        .then((res) => {
        console.log(res);
        if(res.code == 200){
            // console.log("Orders");
            // console.log(res)
            setCartItems(res.cart)
            setPriceTotal(res.total)
            
            setStatus_(parseInt(res.cart[0].cart_info.status));
            setOrderid((res.cart[0].cart_info.id));
            setUseridref((res.cart[0].cart_info.userid));
            const latitudeValue = res.cart[0].cart_info.current_lat;
            const longitudeValue = res.cart[0].cart_info.current_long;

         // Set latitude and longitude in state
      setLatitude(latitudeValue);
      setLongitude(longitudeValue);
      convertToAddress(latitudeValue, longitudeValue);
        
            getDatePlus(res.created_at);
          }else if(res.code == 401){
           
          }
        })
        
        // Rest of your fetch code here
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getShippingAddress.php?userid=${useridref}`, {
          headers: {
              "Authorization": `Bearer ${token}`
          }
          })
          .then(response => response.json())
          .then((res) => {
          console.log(res);
          if(res.code == 200){
              setContactPhone(res.payload.phone);
              setShippingState(res.payload.state);
              setTown(res.payload.town);
              setStreetAddress(res.payload.address);
              setLandmark(res.payload.landmark);
              setHouseNumber(res.payload.house_number)
              setDate(res.payload.updated_at)
            }else if(res.code == 401){
            
              toast.error("An error occured, please login again", {
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
                window.location.href = "/"
              }, 2000)
            }
          })
    
    }, [])

    const convertToAddress = async (latitudeValue, longitudeValue) => {
 
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitudeValue},${longitudeValue}&key=AIzaSyAzU0Mgox4lSxYYiOo45G8hRSu52TQveG4`
        );
        
        // console.log(response.data);
        if (response.data.results.length > 0) {
          setAddress(response.data.results[1].formatted_address);
        } else {
          // Handle case where no address is found
          // setError("No results found for the given coordinates.");
        }
      } catch (err) {
        // Handle any errors that occur during the API request
        // setError("An error occurred while fetching data from the API.");
      }
    };

    const handlePendingStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '1',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // Handle the response as needed
        // console.log(response.data);
  
        if (response.status === 200) {
          // Handle a successful response here
          toast.info(
            'Order is awaiting payment',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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

    const handlePaidStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '2',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // Handle the response as needed
        // console.log(response.data);
        if (response.status === 200) {
          // Handle a successful response here
          toast.success(
            'Ordered Product Mark as Paid, Ready for Processing',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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

    const handleProcessingStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '3',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // Handle the response as needed
        // console.log(response.data);
        if (response.status === 200) {
          // Handle a successful response here
          toast.success(
            'We are currently processing your order with care',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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

    const handleTransitStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '4',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // Handle the response as needed
        // console.log(response.data);
        if (response.status === 200) {
          // Handle a successful response here
          toast.success(
            'Order is now in transit and on its way to your location',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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

    const handleDeliveredStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '5',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // Handle the response as needed
        // console.log(response.data);
        if (response.status === 200) {
          // Handle a successful response here
          toast.success(
            'Order has been successfully delivered. Enjoy your purchase!',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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
    const handleClosedStatus = async (status, itemId) => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Replace with your authentication method
        const headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        };
  
        const body = {
          orderid: orderid,
          status: '6',
        };
  
        const response = await axios.post(
          'https://orangli.com/server/api/Products/updateOrder.php',
          
          body,
          { headers, cache: 'no-store' }
        );
  
        // // Handle the response as needed
        // console.log(response.data);

        if (response.status === 200) {
          // Handle a successful response here
          toast.success(
            'Item as been Delivered and Closed Out',
            {
              position: 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
            }
          );
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
        setError('An error occurred while updating the order status.');
       
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
    <div>
    <ToastContainer/>

    <center> 
    
    <Card title=" Status Variation Badges ">
    {cartItems.map((item) => (

            <div key={item.cart_info.id}>
        <div className="space-xy-5">

          <Button className="bg-secondary-500 text-white"
           onClick={() => handlePendingStatus('pending', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Pending'}</span>
              <Badge  icon="material-symbols:pending-actions-rounded" className="bg-white text-slate-900 " />
            </div>
          </Button>
          
          <Button className="btn-info"
            onClick={() => handlePaidStatus('Paid', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Paid'}</span>
              <Badge  icon="uiw:pay" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-warning"
           onClick={() => handleProcessingStatus('Processing', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'Processing'}</span>
              <Badge  icon="uis:process" className="bg-white text-slate-900 " />
            </div>
          </Button>
          <Button className="btn-dark"
           onClick={() => handleTransitStatus('In-Transit', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span>{isLoading ? 'Updating...' : 'In-Transit '}</span>
              <Badge  icon="wpf:in-transit" className="bg-white text-slate-900" />
            </div>
          </Button>
          <Button className="btn-success"
           onClick={() => handleDeliveredStatus('Delivered', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span> {isLoading ? 'Updating...' : 'Delivered '}</span>
              <Badge  icon="mdi:package-delivered" className="bg-white text-slate-900" />
            </div>
          </Button>
          <Button className="btn-danger"
           onClick={() => handleClosedStatus('Closed', item.cart_info.id)} disabled={isLoading}
          >
            <div className="space-x-1 rtl:space-x-reverse">
              <span> {isLoading ? 'Updating...' : 'Closed '}</span>
              <Badge  icon="ooui:eye-closed" className="bg-white text-slate-900" />
            </div>
          </Button>
        </div>
        </div>
        ))}
        
      </Card>
      </center>

    <Card title="Product Status">
      <div>
      <div className="flex z-[5] items-center relative justify-center md:mx-8">
            {steps.map((item, i) => (
              <div
                className="relative z-[1] items-center item flex flex-start flex-1 last:flex-none group"
                key={i}
              >
                <div
                  className={`${
                    statusIndex >= i
                      ? "bg-slate-900 text-white ring-slate-900 ring-offset-2 dark:ring-offset-slate-500 dark:bg-slate-900 dark:ring-slate-900"
                      : "bg-white ring-slate-900 ring-opacity-70  text-slate-900 dark:text-slate-300 dark:bg-slate-600 dark:ring-slate-600 text-opacity-70"
                  }  transition duration-150 icon-box md:h-12 md:w-12 h-7 w-7 rounded-full flex flex-col items-center justify-center relative z-[66] ring-1 md:text-lg text-base font-medium`}
                >
                  {statusIndex <= i ? (
                    
                    i === 0 ? (
                      <Icon icon="ic:twotone-pending-actions" />// Replace with your first icon
    
    ) : i === 1 ? (
      <Icon icon="flat-color-icons:paid" /> // Replace with your third icon
      ) : i === 2 ? (
      <Icon icon="uis:process" /> // Replace with your second icon
    ) : i === 3 ? (
      <Icon icon="wpf:in-transit" /> // Replace with your third icon
    ) : i === 4 ? (
      <Icon icon="solar:delivery-bold" /> // Replace with your third icon
    ) : i === 5 ? (
      <Icon icon="fluent-mdl2:completed-solid" /> // Replace with your third icon
   
    ) : (
      <span>{i + 1}</span>
    )
                  ) : (
                    <span className="text-3xl">
                      <Icon icon="bx:check-double" />
                    </span>
                  )}
                </div>

                <div
                  className={`${
                    statusIndex >= i
                      ? "bg-slate-900 dark:bg-slate-900"
                      : "bg-[#E0EAFF] dark:bg-slate-700"
                  } absolute top-1/2 h-[2px] w-full`}
                ></div>
                <div
                  className={` ${
                    statusIndex >= i
                      ? " text-slate-900 dark:text-slate-300"
                      : "text-slate-500 dark:text-slate-300 dark:text-opacity-40"
                  } absolute top-full text-base md:leading-6 mt-3 transition duration-150 md:opacity-100 opacity-0 group-hover:opacity-100`}
                >
                  <span className="w-max">{item}</span>
                </div>
              </div>
            ))}
          </div>

        <div className="conten-box ">
          
              <div>
               <br/>
               <br/>
                  <div className="lg:col-span-3 md:col-span-2 col-span-1">
                    <h4 className="text-base text-slate-800 dark:text-slate-300 my-6">
                      Product Order details
                    </h4>
                  </div>
                  
                  
                  <div className="-mx-6 overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
            <table className="min-w-full divide-y table-fixed divide-slate-100 dark:divide-slate-700">
                <thead className="bg-slate-200 dark:bg-slate-700">
                <tr>
                      <th scope="col" className="table-th">
                      ID
                    </th>
                      <th scope="col" className="table-th">
                     Customer ID
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
                {last25Items.map((item) => (
                  <React.Fragment key={item.cart_info?.id}>
                <tbody  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" >
                  
                      <tr >
                      <td className="table-td py-2"> <span>{item.cart_info?.id}</span></td>
                      <td className="table-td py-2 "> <Button text="secondary" className=" btn-primary light" >{item.cart_info?.userid} </Button></td>
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
                        
                        <td className="table-td py-2"> {item.product?.product_name} </td>
                        <td className="table-td py-2">  {naira.format(item.product?.price || "0")}</td>
                        <td className="table-td py-2"> BNPL </td>
                        <td className="table-td py-2"> {item.cart_info?.qty || "0"} </td>
                        <td className="table-td py-2"> 
                        <span className="block w-full">
            <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
              item.order_tracking?.current_status.name === "delivered"
                ? "text-success-500 bg-success-500"
                : ""
            } 
            ${
              item.order_tracking?.current_status.name === "closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
              item.order_tracking?.current_status.name === "delivered"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  item.order_tracking?.current_status.name=== "pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                  item.order_tracking?.current_status.name === "in-transit"
                ? "text-primary-500 bg-primary-500"
                : ""
            }
            
             `}
          >
            {item.order_tracking?.current_status.name}
          </span>
          </span>
              </td>

                        <td className="table-td py-2">  {formattedDate(item.cart_info?.created_at)} </td>

                      </tr> 
                      </tbody>
                      </React.Fragment>
                      ))}
                </table>
                </div>
                </div>
                </div>
                
                </div>
              </div>
          <br/>
          <br/>
         
              <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Shipping information">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="fa-solid:shipping-fast" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Shipping Address
                    </div>
                    <a
                    
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {landmark}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:phone-arrow-up-right" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      PHONE
                    </div>
                    <a
                     href={`tel:${contactPhone}`}

                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {contactPhone}
                    </a>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:map" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      LOCATION
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                    {houseNumber + " " + streetAddress },{town + " " + shippingState}
                    </div>
                  </div>
                </li>
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="fontisto:date" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Date
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                    {formattedDate(date)}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="zondicons:location" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Location status
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                    {address ? <span>{address}</span> : "No address available"}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={190} />
              <div className="text-base text-slate-600 dark:text-slate-50">
                      Total : { priceTotal}
                    </div>  
            </Card>
          </div>
        </div>

         
        </div>
      {/* </div> */}
    </Card>
  </div>
  );

};

export default OrderPage;


