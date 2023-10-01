"use client";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";
import BasicArea from "@/components/partials/chart/appex-chart/BasicArea";
import React,{useEffect,useState,useMemo} from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const profile = () => {

  const [dob, setDOB] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [wallet, setWallet] = useState("");
  const [role, setRole] = useState("");
  const [ref, setRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  
  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  useEffect(() => {
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
    headers: {
        "Authorization": `Bearer ${token}`
    }
    })
    .then(response => response.json())
    .then((res) => {
    console.log(res);
    if(res.code == 200){
      setAvatar(res.user.avatar);
      setFirstname(res.user.first_name);
      setLastname(res.user.last_name);
      setEmail(res.user.email);
      setPhone(res.user.phone);
      setWallet(res.user.wallet);
      setRole(res.user.role);
      setRef(res.user.user_ref_id);
      }else if(res.code == 401){
       
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      }
    })
  

  }, []);

  const updateUserInfo = async () => {
    setIsLoading(true);
  
    try {
      const userid = localStorage.getItem("userid");
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("avatar", avatar);
      data.append("phone", phone);
      data.append("firstname", firstname);
      data.append("lastname", lastname);
  
      if (userid !== null) {
        data.append("userid", userid);
      }
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/updateUser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: data,
      });
  
      const res = await response.json();
  
      if (res.code === 200) {
        toast.error(res.message, {
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
      } else if (res.code === 401) {
        // Handle unauthorized error...
      }
    } catch (error) {
      // Handle other errors...
      console.error(error);
    }
  };
  
  // Call the async function when needed
  // For example, you can call updateUserInfo() in an event handler.
  
      

  return (
    <div>
 <ToastContainer/>
 
            <Modal
             activeModal={activeModal}
              onClose={() => setActiveModal(false)}
              title= {isLoading ? 'Updating...' : 'Update Profile '}
            className="max-w-[48%]"
            footerContent={
              <Button
                text={isLoading ? 'Updating...' : 'Save '}
                className="btn-dark "
                
                onClick={updateUserInfo}
                 disabled={isLoading}
              />
            }
          >
            
            <div className="text-base text-slate-600 dark:text-slate-300">
            <Card title="Update Profile Details">
            <form>
        <div className="space-y-3">
          <Textinput
            label="First Name*"
            id="firstname"
            name="firstname"
            type="text"
            placeholder="First Name"
            onChange={(e) => {
               setFirstname(e.target.value);
                }}
              
            value={firstname}
          />
          <Textinput
            placeholder="Last Name"
            type="text"
            id="lastname"
            name="lastname"
            onChange={(e) => {
             setLastname(e.target.value);
             }}
             value={lastname}
          />
          <Textinput
            type="tel"
            id="phone_number"
            name="phone_number"
             placeholder="8122233345"
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            value={phone}
          />
          <Textinput
             placeholder="Email Address *"
            type="email"
            id="Email Address *"
            name="Email Address *"
            value={email}
            readonly
          />
          
        </div>
        </form>
      </Card>
            </div>
          </Modal>

      <div className="space-y-5 profile-page">
        <div className="profiel-wrap px-[35px] pb-10 md:pt-[84px] pt-10 rounded-lg bg-white dark:bg-slate-800 lg:flex lg:space-y-0 space-y-6 justify-between items-end relative z-[1]">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg">
          <div className="bg-slate-900 dark:bg-slate-700 absolute left-0 top-0 md:h-1/2 h-[150px] w-full z-[-1] rounded-t-lg">
          <div className="flex-none flex md:space-x-3 space-x-1 items-center rtl:space-x-reverse absolute right-3 top-3">
          <Link href={`tel:${phone}`}>
            <div className="msg-action-btn">
              <Icon icon="heroicons-outline:phone"  />
            </div>
            </Link>
            <Link href={`mailto:${email}`}>
            <div className="msg-action-btn">
              <Icon icon="humbleicons:mail" />
            </div>
            </Link>
            <Link href={`https://api.whatsapp.com/send/?phone=${phone}`}>
            <div className="msg-action-btn">
              <Icon icon="mdi:whatsapp" />
            </div>
            </Link>
          </div>
          </div>
          </div>
          <div className="profile-box flex-none md:text-start text-center">
            <div className="md:flex items-end md:space-x-6 rtl:space-x-reverse">
              <div className="flex-none">
              <div className="md:h-[186px] md:w-[186px] h-[140px] w-[140px] md:ml-0 md:mr-0 ml-auto mr-auto md:mb-0 mb-4 rounded-full ring-4 ring-slate-100 relative">
                  <img
                   src={ avatar == ""
                                ? "/assets/images/users/user-1.jpg"
                                : avatar
                            }
                    
                    className="w-full h-full object-cover rounded-full"
                  />
                  <button  className="absolute right-2 h-8 w-8 bg-slate-50 text-slate-600 rounded-full shadow-sm flex flex-col items-center justify-center md:top-[140px] top-[100px]"
                  type="button"
                  onClick={() => setActiveModal(true)}
                  >
                    <Icon icon="heroicons:pencil-square"    />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-2xl font-medium text-slate-900 dark:text-slate-200 mb-[3px]">
                {firstname + " " + lastname}
                </div>
                <div className="text-sm font-light text-slate-600 dark:text-slate-400">
                {role == 1 ?  (
            <div className="inline-block bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
           Genesis360-Admin
            </div> 
            ):(
              <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              Genesis360-User
             
            </div>
            )}
                </div>
              </div>
            </div>
          </div>

          <div className="profile-info-500 md:flex md:text-start text-center flex-1 max-w-[516px] md:space-y-0 space-y-4">
            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
              {naira.format(wallet)}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Total Balance
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {ref}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Referral Code
              </div>
            </div>

            <div className="flex-1">
              <div className="text-base text-slate-900 dark:text-slate-300 font-medium mb-1">
                {email}
              </div>
              <div className="text-sm text-slate-600 font-light dark:text-slate-300">
                Email Address
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="lg:col-span-4 col-span-12">
            <Card title="Info">
              <ul className="list space-y-8">
                <li className="flex space-x-3 rtl:space-x-reverse">
                  <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                    <Icon icon="heroicons:envelope" />
                  </div>
                  <div className="flex-1">
                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                      EMAIL
                    </div>
                    <a
                      href="mailto:someone@example.com"
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {email}
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
                     href={`tel:${phone}`}
                      className="text-base text-slate-600 dark:text-slate-50"
                    >
                      {phone}
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
                    Abeokuta -Igboora - Iseyin Rd, 110103, Ogun State, Nigeria
                    </div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
          <div className="lg:col-span-8 col-span-12">
            <Card title="User Overview">
              <BasicArea height={190} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default profile;
