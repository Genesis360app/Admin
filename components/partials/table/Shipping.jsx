"use client";
import Card from "@/components/ui/Card";
import React,{useEffect,useState,useMemo} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from "@/components/ui/Image";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
// import Select from "@/components/ui/Select";
import Select from 'react-select';
import Map from "./Map";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { InfinitySpin } from 'react-loader-spinner';
import Button from "@/components/ui/Button";

const ShippingAddress = () => {
  const [houseNumber, setHouseNumber] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [landmark, setLandmark] = useState('');
  const [town, setTown] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [lat, setLat] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [long, setLong] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage = {
    message: "This is invalid state",
  };
  const [value, setValue] = useState("");

  const handleFormatter = (e) => {
    const value = e.target.value;
    setValue(value);
  };

  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);


      useEffect(() => {
        const fetchData = async () => {
          try {
            var token = localStorage.getItem("token");
            var userid = localStorage.getItem("userid");
      
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}//User/getAllUsers`, {
              
              headers: {
                "Authorization": `Bearer ${token}`,
                
              }
            });
      
            if (!response.ok) {
              // Handle error if the response is not OK
              toast.warning("Network response was not ok", {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
      
            const res = await response.json();
      
            console.log(res);
      
            if (res.code === 200) {
            
            } else if (res.code === 401) {
              setTimeout(() => {
                router.push("/");
              }, 1500);
            }
          } catch (error) {
         
            // Handle errors here
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
          }
        };
      
        const token = localStorage.getItem("token");
        fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/wallets/listBanks`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then((res) => {
          const banks = res.map((bank) => ({
            value: bank.code,
            label: bank.name,
            slug: bank.slug
          }));
          setBankOptions(banks );
        });

      
        fetchData(); // Call the asynchronous function
      }, []);
          

      const saveInfo = async () => {
        setIsLoading(true);
        toast.success("Please wait...", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        
    var userid = localStorage.getItem('userid');
    var token = localStorage.getItem('token');
    var payload = new FormData();
    
    if (userid) {
      payload.append('userid', userid);
    } else {
      // Handle the case where userid is null
      // console.error('User ID is null');
    }
    
    payload.append('phone', contactPhone);
    payload.append('house_number', houseNumber);
    payload.append('address', streetAddress);
    payload.append('landmark', landmark);
    payload.append('lat', lat);
    payload.append('long', long);
    payload.append('town', town);
    payload.append('state', shippingState);
    
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/setShipping.php`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
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
      });
    };
    
    
      useEffect(() => {
        var userid = localStorage.getItem('userid');
        var token = localStorage.getItem('token');
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getShippingAddress.php?userid=${userid}`, {
        
        cache:'no-cache',
    
        headers: {
            Authorization: `Bearer ${token}`,
          },
         
        })
          .then((response) => response.json())
          .then((res) => {
            console.log(res);
            if (res.code === 200) {
              setContactPhone(res.payload.phone);
              setShippingState(res.payload.state);
              setTown(res.payload.town);
              setLatitude(res.payload.latitude);
              setLongitude(res.payload.longitude);
    
              setStreetAddress(res.payload.address);
              setLandmark(res.payload.landmark);
              setHouseNumber(res.payload.house_number);
              setLat(res.payload.lat);
              setLong(res.payload.long);
            } else if (res.code === 401) {
              
              toast.error("An error occurred, please login again", {
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
                window.location.href = '/';
              }, 2000);
            }
          });
      }, 
      
      
      []);
    
      const handleSelect = async (selectedAddress) => {
        try {
          const results = await geocodeByAddress(selectedAddress);
          const latLng = await getLatLng(results[0]);
          
          setLat(latLng.lat.toString());
          setLong(latLng.lng.toString());
          setLandmark(selectedAddress);
          
        } catch (error) {
          console.error('Error fetching location data:', error);
    
          toast.error(`Error fetching location data: ${error}`, {
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

      const customStyles = {
        control: (provided, state) => ({
          ...provided,
          backgroundColor: '#ffffff', // Set the background color of the input box to black
          // Add other custom styles for the control here
        }),
        menu: (provided, state) => ({
          ...provided,
          backgroundColor: '#110634', // Set the background color of the options list to black
          // Add other custom styles for the menu here
        }),
      };
      
  return (
    <div>
    
        <Map/>

        <Card title="User Shipping info ">
        <form>
        <div className="space-y-3">
        
        {/* <div className="mt-[30px]">
        <label
         htmlFor="User"  className="form-label  mb-2"  >
        Select User
        </label>
        
<Select
  id="bank"
  name="bank"
  onChange={(selectedOption) => {
    setSelectedBank(selectedOption);
    console.log("Selected Bank:", selectedOption);
  }}
  value={selectedBank}
  options={bankOptions}
  styles={customStyles} // Apply custom styles
  className="form-control py-2 appearance-none"
/>
</div> */}


           <div className="mt-[30px]">
       <label
         htmlFor="shipping"
        //  className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"     
        className="form-label  mb-2"     
        >
        Shipping Address
        </label>

               <PlacesAutocomplete value={landmark} onChange={(e) => setLandmark(e)} onSelect={handleSelect}>

      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div>
       <input
                  {...getInputProps({
             placeholder: 'Search Places ...',
             className: 'location-search-input',
           })}
           className="form-control py-2  appearance-none"
               />
             <div className='autocomplete-dropdown-container'>
             {loading && <div>Loading...</div>}
             {suggestions.map((suggestion) => {
             const className = suggestion.active
              ? 'suggestion-item--active'
              : 'suggestion-item';
         // inline style for demonstration purpose
       const style = suggestion.active
         ? { backgroundColor: '#064762', cursor: 'pointer' }
         : { backgroundColor: '#060524', cursor: 'pointer' };
       return (
         <>
         <div
         // key={suggestion.description}
           {...getSuggestionItemProps(suggestion, {
             className,
             style,
           })}
         >
           <span>{suggestion.description}</span>
         </div>
         </>
       );

     })}
   </div>
 </div>
)}
</PlacesAutocomplete>
  </div>
          <Textinput
            label="House Number/Suite*"
            id="suite"
            name="suite"
            type="text"
            placeholder=" Enter House Number/Suite "
            onChange={(e) => {
              setHouseNumber(e.target.value);
            }}
            value={houseNumber}
            // error={errorMessage}
            // msgTooltip
          />

          <Textinput
            label="Phone Number"
            id="phone"
            prepend="NGN (+234)"
            type='tel'
            name='phone_number'
             placeholder='8139-------'
            onChange={(e) => {
              setContactPhone(e.target.value);
             }}
             value={contactPhone}
             
          />

          <Textinput
            label=" Street Address"
            id="street"
            name='street'
            type="text"
            placeholder=" Enter Street Address"
            onChange={(e) => {
               setStreetAddress(e.target.value);
                }}
            value={streetAddress}
          />
           <Textinput
            label=" City"
            id="city"
            name='city'
            type="text"
            placeholder=" Enter City"
            onChange={(e) => {
              setTown(e.target.value);
            }}
            value={town}
                          
          />
          <Textinput
            label=" State"
            id="state"
            name='state'
            type="text"
            placeholder=" Enter State"
            onChange={(e) => {
             setShippingState(e.target.value);
           }}
          value={shippingState}
                          
          />
          <input
            label=""
            id="lat"
            type="text"
            onChange={(e) => {
             setLat(e.target.value);
           }}
           value={lat}
          hidden            
          />
          <input
            label=""
            id="lat"
            type="text"
            onChange={(e) => {
             setLat(e.target.value);
           }}
           value={lat}
          hidden
                          
          />
         
         
<Button  className="btn-outline-dark"  onClick={saveInfo} disabled={isLoading}>
{isLoading ? 
                    <center>
                   <InfinitySpin 
                    width='60'
                    color="#00b09b"
                      />
                        </center> : 'Save'}
                        </Button>
        </div>
        </form>
      </Card>
    </div>
  );
};

export default ShippingAddress;
