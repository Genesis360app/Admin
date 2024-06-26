"use client";

import React,{useEffect,useState,useMemo} from "react";
import Textinput from "@/components/ui/Textinput";
import Card from "@/components/ui/Card";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { InfinitySpin } from 'react-loader-spinner';
import Map from "@/components/partials/table/Map";
import dynamic from "next/dynamic";

const Simple = () => {
    const [kilometre, setKilometre] = useState('');
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const BasicMap = dynamic(() => import("@/components/partials/map/basic-map"), {
        ssr: false,
      });
      

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
        
   
    var token = localStorage.getItem('token');
    var userid = localStorage.getItem('userid');
    var payload = new FormData();
    payload.append('kilometre', kilometre);
    payload.append('amount', amount);


    fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/logistics/set_pricing/${userid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
      body: payload,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
        console.log(data);
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
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);

    } else if (data.code === 400) {
        console.log(data);
        toast.error(data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
  

    }
});

};  


useEffect(() => {
  var userid = localStorage.getItem('userid');
  var token = localStorage.getItem('token');
  fetch(`${process.env.NEXT_PUBLIC_BASE2_URL}/logistics/get_pricing/${userid}`, {
  
  cache:'no-cache',

  headers: {
      Authorization: `Bearer ${token}`,
    },
   
  })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      if (res.code === 200) {
        
        
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
  

  return (
    
    
    <>
    
    <div className=" space-y-5">
      <Card title="Basic Map">
        <Map />
      </Card>
     
    </div>
    <br/>
      <div className="grid xl:grid-cols-2  grid-cols-1 gap-5">
        <Card title="Delivery Fee Settings">
          <form  className="space-y-4 ">
            <Textinput
              name="Kilometer"
              label="Distance in Kilometer (km)"
              type="text"
              placeholder="Enter Distance in Kilometer (km)"
              onChange={(e) => {
               setKilometre(e.target.value);
                }}
            // value={Kilometer}
            />
            <Textinput
              name="amount"
              label="Amount (charges)"
              type="text"
              placeholder="Enter Amount"
              onChange={(e) => {
               setAmount(e.target.value);
                }}
                // value={Kilometer}
            />
  
            <div className="ltr:text-right rtl:text-left">
              <button className="btn btn-dark  text-center"
              onClick={saveInfo} disabled={isLoading}
              >
              
              {isLoading ? 
                    <center>
                   <InfinitySpin 
                    width='60'
                    color="#00b09b"
                      />
                        </center> : 'Submit'}
              </button>
            </div>
          </form>
        </Card>
      </div>
    </>
 
  
  );
};

export default Simple;


