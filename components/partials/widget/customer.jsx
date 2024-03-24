import ProgressBar from "@/components/ui/ProgressBar";
import React, { useEffect, useState } from "react";
import { userService } from "@/services/users.service";
import Icon from "@/components/ui/Icon";
// import { color } from "framer-motion";
const Customer = () => {
  

  const [allUsers, setAllUsers] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userService.fetchUsers(); // Call fetchUsers as a function
  
        if (response) {
          // console.log(response); // Use response.data
          setAllUsers(response);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

    // Transform allUsers into the desired format
    const transformedUsers = allUsers.map((user, i) => ({
      title: user.email, // Assuming the user object has a "name" property
      Fname: user.first_name, // Assuming the user object has a "name" property
      Lname: user.last_name, // Assuming the user object has a "name" property
      img: user.image, // Assuming the user object has a "profileImage" property
      isVerified: user.isVerified, // Replace with the actual property from the user object
      Business: user.isBusiness, // Replace with the actual property from the user object
      loanOutstanding:user.loanOutstanding,
      loanLimit:user.loanLimit,
      bg: "before:bg-info-500",
      barColor: "bg-info-500",
      barColor2: "bg-warning-500",
      number: i + 1, // Assign a unique number based on the index
    }));
  
    const customers = transformedUsers.slice(-3); // Use the last 3 transformed users
    const customers_two = transformedUsers.slice(-6, -3); // Use the last 3 transformed users

  
  return (
    <div className="pb-2">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5">
        {customers.map((item, i) => (
          
          <div
            key={i}
            
            className={` relative z-[1] text-center p-4 rounded before:w-full before:h-[calc(100%-60px)] before:absolute before:left-0 before:top-[60px] before:rounded before:z-[-1] before:bg-opacity-[0.1] ${item.bg}`}
          >
            <div
              className="ring-2 ring-[#FFC155] h-[70px] w-[70px] rounded-full mx-auto mb-4 relative"
            >
              {item.isVerified === true && (
                <span className="crown absolute -top-[24px] left-1/2 -translate-x-1/2">
                  <img src="/assets/images/icon/crown.svg" alt="" />
                </span>
              )}
              {item.Business == true ?
              
              <img
               src={item.img ? item.img : " https://cdnb.artstation.com/p/assets/images/images/034/457/389/large/shin-min-jeong-.jpg?1612345145"}

                alt=""
                className="w-full h-full rounded-full"
              />
              :
              <img
                src={item.img ? item.img : "https://cdnb.artstation.com/p/assets/images/images/034/457/413/large/shin-min-jeong-.jpg?1612345200"}

                alt=""
                className="w-full h-full rounded-full"
              />
            }


            {item.isVerified == true ?  (
              <span className="h-[27px] w-[27px] absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-xs font-medium">
              <Icon icon="bitcoin-icons:verify-filled" width={28} className="text-success-800" />

           </span> 
            ):(
              <span className="h-[27px] w-[27px] absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-xs font-medium">
              <Icon icon="bitcoin-icons:verify-filled" width={28} className="text-danger-800" />

              </span>
            )}
          
              
            </div>
            <h4 className="text-sm text-slate-600 font-semibold mb-4">
              {item.Fname + "  " + item.Lname}
            </h4>
            <h4 className="text-sm text-slate-600 font-semibold mb-4">
            {item.title.slice(0, 8)}...{item.title.slice(-10)}
            </h4>
            {item.Business == true ?  (
            <div className="inline-block bg-slate-900 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
            Business Account
            </div> 
            ):(
              <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              Individual Account
             
            </div>
            )}
            
            <div>
              <div className="flex justify-between text-sm font-normal dark:text-slate-300 mb-3 mt-4">
                <span>Loan Outstanding</span>
                <span className="font-normal">{item.loanOutstanding}</span>
              </div>
              <ProgressBar value={item.loanLimit} className={item.barColor} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 mt-5">
        {customers_two.map((item, i) => (
          <div
            key={i}
            className="relative z-[1] p-4 rounded md:flex items-center bg-gray-5003 dark:bg-slate-900 md:space-x-10 md:space-y-0 space-y-3 rtl:space-x-reverse"
          >
            <div
              className={`${
                item.isVerified ===true ? "ring-2 ring-[#FFC155]" : ""
              } h-10 w-10 rounded-full relative`}  
            >
              {item.isVerified ===true && (
                <span className="crown absolute -top-[14px] left-1/2 -translate-x-1/2">
                  <img src="/assets/images/icon/crown.svg" alt="" />
                </span>
              )}

             
              {item.Business == true ?
              
                <img
               src={item.img ? item.img : " https://cdnb.artstation.com/p/assets/images/images/034/457/389/large/shin-min-jeong-.jpg?1612345145"}

                alt=""
                className="w-full h-full rounded-full"
              />
              :
              <img
                src={item.img ? item.img : "https://cdnb.artstation.com/p/assets/images/images/034/457/413/large/shin-min-jeong-.jpg?1612345200"}

                alt=""
                className="w-full h-full rounded-full"
              />
              
            }
             
           
            {item.isVerified == true ?  (
              <span className="h-[27px] w-[27px] absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-xs font-medium">
              <Icon icon="bitcoin-icons:verify-filled" width={28} className="text-success-800" />

           </span> 
            ):(
              <span className="h-[27px] w-[27px] absolute right-0 bottom-0 rounded-full bg-[#FFC155] border border-white flex flex-col items-center justify-center text-white text-xs font-medium">
              <Icon icon="bitcoin-icons:verify-filled" width={28} className="text-danger-800" />

              </span>
            )}
          
            </div>
            <h4 className="text-sm text-slate-600 font-semibold">
            {item.Fname + "  " + item.Lname}
            </h4>
            <h4 className="text-sm text-slate-600 font-semibold">
            {item.title.slice(0, 8)}...{item.title.slice(-10)}
            </h4>
            {item.Business == true ?  (
            <div className="inline-block bg-slate-700 text-white px-[5px] py-[6px] text-xs font-medium rounded-full min-w-[90px]">
            Business Account
            </div> 
            ):(
              <div className="inline-block bg-success-500 text-white px-[10px] py-[6px] text-xs font-medium rounded-full min-w-[60px]">
              Individual Account 
             
            </div>
            )}
            <div className="flex-1">
              <div className="flex justify-between text-sm font-normal dark:text-slate-300 mb-3">
              <span>Loan Outstanding</span>
                <span className="font-normal">{item.loanOutstanding}%</span>
              </div>
              <ProgressBar value={item.loanLimit} className={item.barColor2} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer;
