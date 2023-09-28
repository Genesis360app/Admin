"use client";
import React, { useState, useEffect,Fragment } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "@/components/ui/Select";

const PricingPage = () => {
  const [check, setCheck] = useState(true);
  const toggle = () => {setCheck(!check); };
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedNewPass, setConfirmedNewPass] = useState("");
  const [phone, setPhone] = useState("");
  const [ref_id, setRef_id] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState("");
  const [rcNumber, setRcNumber] = useState("");
 const [business_name, setBusiness_name ] = useState("");
  const [business_address, setBusiness_address ] = useState("");
  const [business_category, setBusiness_category ] = useState("");
// customer account
  const [firstname1, setFirstname1] = useState("");
  const [lastname1, setLastname1] = useState("");
  const [email1, setEmail1] = useState("");
  const [password1, setPassword1] = useState("");
  const [confirmedNewPass1, setConfirmedNewPass1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [ref_id1, setRef_id1] = useState("");
  const [username1, setUsername1] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };


  async function handleCustomer(e) {
    e.preventDefault();
    setIsLoading1(true);
  
    try {
      var form = new FormData();
             form.append("email", email1);
              form.append("phone", phone1);
              form.append("username", username1);
              form.append("last_name", lastname1);
              form.append("first_name", firstname1);
              form.append("password", password1);
              form.append("ref_id", ref_id1);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/Register.php`,
        {
          method: "POST",
          body: form,
        }
      );
   
      const data_ = await response.json();
  
      if (data_.code === 200) {
        toast.success(data_.message, {
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
        }, 2000);
        setIsLoading1(false);
      } else {
        toast.error(data_.message, {
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
    } catch (error) {
      // Handle any errors here
    //   console.error(error);
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
    } finally {
      setIsLoading1(false);
    }
  }
  


  async function handleBusiness(e) {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      var datas = new FormData();
      datas.append("email", email);
      datas.append("phone", phone);
      datas.append("username", username);
      datas.append("last_name", lastname);
      datas.append("first_name", firstname);
      datas.append("password", password);
      datas.append("ref_id", ref_id);
      datas.append("business_category", business_category);
      datas.append("business_name", business_name);
      datas.append("business_address", business_address);
      datas.append("isRegistered", isRegistered);
      datas.append("rcNumber", rcNumber);
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/RegisterBusiness`,
        {
          method: "POST",
          body: datas,
        }
      );
  
      const data_ = await response.json();
  
      if (data_.code === 200) {
        toast.success(data_.message, {
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
        }, 2000);
      } else {
        toast.error(data_.message, {
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
    } catch (error) {
      // Handle any errors here
    //   console.error(error);
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
    } finally {
      setIsLoading(false);
    }
  }
  

  return (
    <div>
    <ToastContainer/>
      <div className="flex justify-between mb-6">
        <h4 className="text-slate-900 text-xl font-medium">Create a new users Account</h4>
        <label className="inline-flex text-sm cursor-pointer">
          <input type="checkbox" onChange={toggle} hidden />
          <span
            className={`${
              check
                ? "bg-slate-900 dark:bg-slate-900 text-white"
                : "dark:text-slate-300"
            } 
            px-[18px] py-1 transition duration-100 rounded`}
          >
            Customers
          </span>
          <span
            className={`
            ${
              !check
                ? "bg-slate-900 dark:bg-slate-900 text-white"
                : " dark:text-slate-300"
            }
            px-[18px] py-1 transition duration-100 rounded
            `}
          >
            Business
          </span>
        </label>
      </div>

      {check ? (

        <Card title="Customers Account" >
        <form >
        <div className="space-y-4">
          <Textinput
            label="First Name"
            id="firstname"
            name="firstname"
            type="text"
            placeholder="Enter first name "
            required
            onChange={(e) => {
            setFirstname1(e.target.value)
          }}
          />
          <Textinput
            label="Last Name"
            id="lastname"
            name="lastname"
            type="text"
            placeholder="Enter last name "
            required
            onChange={(e) => {
            setLastname1(e.target.value)
          }}
          />
          
          <Textinput
            label="Username"
            id="username"
            name="username"
            type="text"
            placeholder="Type your Username"
            required
            onChange={(e) => {
            setUsername1(e.target.value)
          }} 
          />
          <Textinput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Type your email"
            required
          onChange={(e) => {
            setEmail1(e.target.value)
          }} 
          />
          <Textinput
            label="Phone Number"
            id="phone"
            name="phone"
            type="phone"
            placeholder="Type your phone number"
            required
            onChange={(e) => {
            setPhone1(e.target.value)
          }}
          />
          <Textinput
            label="Referral Code optional"
            id="ref_id"
            name="ref_id"
            type="text"
            required
            placeholder="Enter referral code"
            onChange={(e) => {
            setRef_id1(e.target.value)
          }}
          />
<Textinput
  label="Password"
  id="password"
  name="password"
  type={passwordVisibility ? "text" : "password"}
  required
  placeholder="8+ characters, 1 capital letter"
  endAdornment={
    <span
      className="cursor-pointer"
      onClick={togglePasswordVisibility}
    >
      {passwordVisibility ? (
          <Icon icon="heroicons:eye" />
        ) : (
          <Icon icon="heroicons:eye" />
        )}
    </span>
  }
  onChange={(e) => {
    setPassword1(e.target.value);
  }}
/>  
<Textinput
  label="Confirm Password"
  id="confirm_new_password"
  name="confirm_new_password"
  type={passwordVisibility ? "text" : "password"}
  required
  placeholder="8+ characters, 1 capital letter"
  endAdornment={
    <span
      className="cursor-pointer"
      onClick={togglePasswordVisibility}
    >
      {passwordVisibility ? (
          <Icon icon="heroicons:eye" />
        ) : (
          <Icon icon="heroicons:eye" />
        )}
    </span>
  }
  onChange={(e) => {
 setConfirmedNewPass1(e.target.value); // Store the confirmed password
}}
/>  
<div className=" space-y-4">
          <Button type="submit" className="btn-dark"  onClick={handleCustomer}  disabled={password1 !== confirmedNewPass1 ||isLoading1}>

                   {isLoading ? 'Please wait...' : 'Create Account'}
                   </Button>
          </div>
        </div>
        </form>
      </Card>
            ) : (
        

        <Card title="Business Account" >
        <form  >
        <div className="space-y-4">
          <Textinput
            label="First Name"
            id="firstname"
            name="firstname"
            type="text"
            placeholder="Enter first name "
            required
            onChange={(e) => {
            setFirstname(e.target.value)
          }}
          />
          <Textinput
            label="Last Name"
            id="lastname"
            name="lastname"
            type="text"
            placeholder="Enter last name "
            required
            onChange={(e) => {
            setLastname(e.target.value)
          }}
          />
          
          <Textinput
            label="Username"
            id="username"
            name="username"
            type="text"
            placeholder="Type your Username"
            required
            onChange={(e) => {
            setUsername(e.target.value)
          }} 
          />
          <Textinput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Type your email"
            required
          onChange={(e) => {
            setEmail(e.target.value)
          }} 
          />
          <Textinput
            label="Phone Number"
            id="phone"
            name="phone"
            type="phone"
            placeholder="Type your phone number"
            required
            onChange={(e) => {
            setPhone(e.target.value)
          }}
          />


<div className="mt-[30px]">
  <label
    htmlFor="Business Registered"
    className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"     
  >
Registered?
  </label>
  <select
    id="isRegistered"
    name="isRegistered"
    required
    onChange={(e) => {
      setIsRegistered(e.target.value);
    }}
   
    value={isRegistered}
    className="form-control py-2  appearance-none"
  >
    <option value="">Is this business registered?</option>
    {Registered.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
</div>

<div className={`mt-[30px] ${isRegistered === "1" ? 'opacity-100 h-auto max-h-[1000px] transition ease-in-out duration-300' : 'opacity-0 h-0 max-h-0 overflow-hidden transition ease-in-out duration-300'}`}>
  <label
    htmlFor="rcNumber"
    className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"  
  >
    Reg_Number
  </label>
  <input
    placeholder="Registration Number"
    type="text"
    id="rcNumber"
    name="rcNumber"
    required
    onChange={(e) => {
      setRcNumber(e.target.value);
    }}
    className="form-control py-2  appearance-none"
  />
</div>

<Textinput
            label="Business Name"
            id="business_name"
            name="business_name"
            type="text"
            required
            placeholder="Enter business name"
            onChange={(e) => {
                    setBusiness_name(e.target.value)
                  }}
          />

<div className="mt-[30px]">
  <label
    htmlFor="Business Registered"
    className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"     
  >
 Business Category *
  </label>
  <select
     id="Category"
     name="Category"
    required 
     onChange={(e) => {
      setBusiness_category(e.target.value);
      }}
                   
    value={business_category}
    className="form-control py-2  appearance-none"
      >
     <option value="">Select Business Category</option>
    {bizcategory.map((option) => (
    <option key={option.value} value={option.value}>
 {option.label}
           </option>
       ))}
      </select>
</div>

            <Textinput
            label="Business Address"
            id="address"
            name="address"
            type="text"
            required
            placeholder="Enter Business address"
            onChange={(e) => {
                    setBusiness_address(e.target.value)
                  }}
          />

          <Textinput
            label="Referral Code optional"
            id="ref_id"
            name="ref_id"
            type="text"
            required
            placeholder="Enter referral code"
            onChange={(e) => {
            setRef_id(e.target.value)
          }}
          />




<Textinput
  label="Password"
  id="password"
  name="password"
  type={passwordVisibility ? "text" : "password"}
  required
  placeholder="Enter password"
  endAdornment={
    <span
      className="cursor-pointer"
      onClick={togglePasswordVisibility}
    >
      {passwordVisibility ? (
          <Icon icon="heroicons:eye" />
        ) : (
          <Icon icon="heroicons:eye" />
        )}
    </span>
  }
  onChange={(e) => {
    setPassword(e.target.value);
  }}
/>  
<Textinput
  label="Confirm Password"
  id="confirm_new_password"
  name="confirm_new_password"
  type={passwordVisibility ? "text" : "password"}
  required
  placeholder="Enter password"
  endAdornment={
    <span
      className="cursor-pointer"
      onClick={togglePasswordVisibility}
    >
      {passwordVisibility ? (
          <Icon icon="heroicons:eye" />
        ) : (
          <Icon icon="heroicons:eye" />
        )}
    </span>
  }
  onChange={(e) => {
 setConfirmedNewPass(e.target.value); // Store the confirmed password
}}
/>  
<div className=" space-y-4">
          <Button type="submit" className="btn-dark"   disabled={password !== confirmedNewPass ||isLoading}
          onClick={handleBusiness}
          
          >

                   {isLoading ? 'Please wait...' : 'Create Account'}
                   </Button>
          </div>
        </div>
        </form>
      </Card>
      )}
    </div>
  );
};

const bizcategory = [
    { value: 'Restaurant', 
      label: 'Restaurant'
   },
  
    { value: 'Supermarket', 
      label: 'Supermarket' 
  }
  ];
  
  const Registered = [
   
  {
    value: 0,
    label: "No",
  },
  {
    value: 1,
    label: "Yes",
  },
  
  ];

export default PricingPage;
 
