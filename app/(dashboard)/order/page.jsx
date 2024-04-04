"use client";
import React,{useEffect,useState,Fragment,useRef} from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from "@/components/ui/Card";
import Tooltip from "@/components/ui/Tooltip";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import axios from 'axios';
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import { useParams } from 'react-router-dom';
import { orderService } from "@/services/order.services";
import HTMLReactParser from "html-react-parser";
import { _notifyError } from "@/utils/alart";

const OrderPage = () => {
    // const router = useRouter();
    // const routerId = router.query.id; 
     
    const { id } = useParams();
    
  const getStatus = (status ) => {
    switch (status) {
     case "Pending":
       return "Pending";
     case "Paid":
       return "Paid";
     case  "Processing":
       return "Processing";
     case "In-Transit":
       return "In-transit";
     case "Delivered":
       return "Delivering";
     case "Closed":
       return "Completed";
     default:
       return "";
    }
  
   }

  const [status_, setStatus_] = useState("");
  const orderStatus = getStatus(status_);
  const steps = ["Pending", "Paid", "Processing", "in-transit", "Delivering", "Complete"];
  const statusIndex = steps.indexOf(orderStatus);
  const [cartItems, setCartItems] = useState([]);
  const [orderid, setOrderid ]= useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [country, setCountry] = useState("");
  const [dateOrdered, setDateOrdered] = useState("");
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [orderId, setOrderId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [totalPrice, setPrice] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [status, setStatus] = useState("");
  const [actualDelivery, setActualDelivery] = useState("");
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  

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

// const last25Items = cartItems;

// // Sort the last 25 items by the 'id' property in ascending order
// last25Items.sort((a, b) => {
//   const idA = a.cart_info?.id || 0; // Use a default value if 'a.cart_info.id' is null
//   const idB = b.cart_info?.id || 0; // Use a default value if 'b.cart_info.id' is null

//   return idB - idA; // Sort in ascending order by 'id'
// });

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

    // useEffect(() => {
       
    //     var userid = localStorage.getItem("userid");
    //     var id = localStorage.getItem("id");
    //     var token = localStorage.getItem("token");
    
    //     // fetch(`https://orangli.com/server/api/Products/orderById.php?orderid=${routerId}`, {
    //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Products/orderById.php?orderid=777`, {
    //     headers: {
    //         "Authorization": `Bearer ${token}`
    //     }
    //     })
    //     .then(response => response.json())
    //     .then((res) => {
    //     // console.log(res);
    //     if(res.code == 200){
    //         // console.log("Orders");
    //         // console.log(res)
    //         setCartItems(res.cart)
    //         setPriceTotal(res.total)
            
    //         setStatus_(parseInt(res.cart[0].cart_info.status));
    //         setOrderid((res.cart[0].cart_info.id));
    //         setUseridref((res.cart[0].cart_info.userid));
    //         const latitudeValue = res.cart[0].cart_info.current_lat;
    //         const longitudeValue = res.cart[0].cart_info.current_long;

    //      // Set latitude and longitude in state
    //   setLatitude(latitudeValue);
    //   setLongitude(longitudeValue);
    //   convertToAddress(latitudeValue, longitudeValue);
        
    //         getDatePlus(res.created_at);
    //       }else if(res.code == 401){
           
    //       }
    //     })
        
    //     // Rest of your fetch code here
    //     fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getShippingAddress.php?userid=${useridref}`, {
    //       headers: {
    //           "Authorization": `Bearer ${token}`
    //       }
    //       })
    //       .then(response => response.json())
    //       .then((res) => {
    //       // console.log(res);
    //       if(res.code == 200){
    //           setContactPhone(res.payload.phone);
    //           setShippingState(res.payload.state);
    //           setTown(res.payload.town);
    //           setStreetAddress(res.payload.address);
    //           setLandmark(res.payload.landmark);
    //           setHouseNumber(res.payload.house_number)
    //           setDate(res.payload.updated_at)
    //         }else if(res.code == 401){
            
    //           toast.error("An error occured, please login again", {
    //             position: "top-right",
    //             autoClose: 1500,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //             theme: "light",
    //           });
    //           setTimeout(() => {
    //             window.location.href = "/"
    //           }, 2000)
    //         }
    //       })
    
    // }, [])


    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await orderService.orderById(); // Call fetchUsers as a function
  
          if (response) {
            // console.log(response); // Use response.data
            setCartItems(response.orderItems);
            setCity(response.city);
            setZip(response.zip);
            setContactPhone(response.phone);
            setCountry(response.country);
            setDateOrdered(response.dateOrdered);
            setShippingAddress1(response.shippingAddress1);
            setShippingAddress2(response.shippingAddress2);
            setOrderId(response.id);
            setFullName (response.user.fullName);
            setPhone(response.phone);
            setLocation(response.trackingId.location);
            setPrice(response.totalPrice);
            setPaymentMode(response.transaction.paymentMode);
            setStatus_(response.transaction.status);
            console.log("status",response.transaction.status);
            setActualDelivery(response.trackingId.actualDelivery);
            setEstimatedDelivery(response.trackingId.estimatedDelivery);

          } else {
            // Handle case where response or response.data is undefined
          }
        } catch (err) {
          // console.error("Error:", err);
          _notifyError(err.message);
        }
      };
      fetchData();
    }, []);



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

    {/* <center> 
   
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
      </center> */}

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
                    
                    i === "Pending" ? (
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
                      Customer Username
                    </th>
                    <th scope="col" className="table-th">
                      Mobile Number
                    </th>
                    <th scope="col" className="table-th">
                      Location
                    </th>
                    <th scope="col" className="table-th">
                      Price
                    </th>
                    <th scope="col" className="table-th">
                      Payment Channel
                    </th>

                    <th scope="col" className="table-th">
                      City
                    </th>

                    <th scope="col" className="table-th">
                      Status
                    </th>
                    <th scope="col" className="table-th">
                      Date
                    </th>
                    <th scope="col" className="table-th">
                      Est-Delivery
                    </th>

                    
                  </tr>
                </thead>
               
                  <React.Fragment >
                  <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      <tr>
                        <td className="table-td py-2">
                        
                          <span>
                            {orderId.slice(0, 8)}...{orderId.slice(-10)}
                          </span>
                        </td>
                        <td className="table-td py-2 ">
                         
                          {fullName}
                        </td>
                        <td className="table-td py-2 ">

                          {"+234" + phone}
                        </td>

                       

                        <td className="table-td py-2 ">
                          {location || "No Location"}
                        </td>
                        <td className="table-td py-2">
                          
                          {naira.format(totalPrice || "0")}
                        </td>
                        <td className="table-td py-2">
                         
                          {paymentMode}
                        </td>

                        <td className="table-td py-2"> {city} </td>
                        <td className="table-td py-2">
                          <span className="block w-full">
                            <span
                              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 ${
                                status_ === "Delivered"
                                  ? "text-success-500 bg-success-500"
                                  : ""
                              } 
            ${
             status_ === "Closed"
                ? "text-warning-500 bg-warning-500"
                : ""
            }
            ${
              status_ === "Paid"
                ? "text-info-500 bg-info-500"
                : ""
            }
            ${
              status_ === "Processing"
                ? "text-processing-400 bg-processing-400"
                : ""
            }
            ${
            status_ === "Closed"
                ? "text-danger-500 bg-danger-500"
                : ""
            }
                ${
                  status_ === "Pending"
                    ? "text-pending-500 bg-pending-500"
                    : ""
                } ${
                               status_ === "In-transit"
                                  ? "text-primary-500 bg-primary-500"
                                  : ""
                              }
            
             `}
                            >
                              {status_}
                            </span>
                          </span>
                        </td>

                        <td className="table-td py-2">
                          
                          {formattedDate(actualDelivery)}
                        </td>
                        <td className="table-td py-2">
                          
                          {formattedDate(
                            estimatedDelivery
                          )}
                        </td>

                       
                      </tr>
                    </tbody>
                      </React.Fragment>
                    
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
                   {shippingAddress1}
                   {shippingAddress2}
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
                    {city },{country}
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
                    {formattedDate(dateOrdered)}
                    </div>
                  </div>
                </li>

                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="zondicons:location" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      Zip Code
                    </div>
                    <div className="text-base text-slate-600 dark:text-slate-50">
                    {zip ? <span>{zip}</span> : "No zipcode available"}
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="Status Variation Badges">
           

           <div >
       <div className="space-xy-5">

         <Button className="bg-secondary-500 text-white"
         //  onClick={() => handlePendingStatus('pending', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span>{isLoading ? 'Updating...' : 'Pending'}</span>
             <Badge  icon="material-symbols:pending-actions-rounded" className="bg-white text-slate-900 " />
           </div>
         </Button>
         
         <Button className="btn-info"
           // onClick={() => handlePaidStatus('Paid', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span>{isLoading ? 'Updating...' : 'Paid'}</span>
             <Badge  icon="uiw:pay" className="bg-white text-slate-900 " />
           </div>
         </Button>
         <Button className="btn-warning"
         //  onClick={() => handleProcessingStatus('Processing', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span>{isLoading ? 'Updating...' : 'Processing'}</span>
             <Badge  icon="uis:process" className="bg-white text-slate-900 " />
           </div>
         </Button>
         <Button className="btn-dark"
         //  onClick={() => handleTransitStatus('In-Transit', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span>{isLoading ? 'Updating...' : 'In-Transit '}</span>
             <Badge  icon="wpf:in-transit" className="bg-white text-slate-900" />
           </div>
         </Button>
         <Button className="btn-success"
         //  onClick={() => handleDeliveredStatus('Delivered', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span> {isLoading ? 'Updating...' : 'Delivered '}</span>
             <Badge  icon="mdi:package-delivered" className="bg-white text-slate-900" />
           </div>
         </Button>
         <Button className="btn-danger"
         //  onClick={() => handleClosedStatus('Closed', item.cart_info.id)} disabled={isLoading}
         >
           <div className="space-x-1 rtl:space-x-reverse">
             <span> {isLoading ? 'Updating...' : 'Closed '}</span>
             <Badge  icon="ooui:eye-closed" className="bg-white text-slate-900" />
           </div>
         </Button>
       </div>
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


