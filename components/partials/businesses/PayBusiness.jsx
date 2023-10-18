"use client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React,{useEffect,useState,useRef} from "react";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Card from "@/components/ui/Card";

const BalnkPage = () => {
    const [account_number, setAccount_number] = useState("");
  const [account_name, setAccount_name] = useState("");
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState(null);
  const [bankOptions, setBankOptions] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);
  const [showWithdrawButton, setShowWithdrawButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [user_id, setUser_id] = useState('');
  const [userId, setUserId] = useState('');
  const [recieveremail, setRecieveremail] = useState('');
  const [email, setEmail] = useState('');
  const [sendamount, setSendamount] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const naira = new Intl.NumberFormat('en-NG', {
    style : 'currency', 
    currency: 'NGN',
   maximumFractionDigits:0,
   minimumFractionDigits:0
  
  });
  const wallet_balance = wallet;

  useEffect(() => {
    var token = localStorage.getItem("token");
    var userid = localStorage.getItem("userid");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
      headers: {
          "Authorization": `Bearer ${token}`
      }
      })
      .then(response => response.json())
      .then((res) => {
    //   console.log(res);
      if(res.code == 200){
         
          setWallet(res.user.wallet);
          setUser_id(res.user.user_id);
          setEmail(res.user.email);
        }
      });
  }, []);


    const send_bizMoney = async () => {

        if (wallet !== null) {
          if (wallet <= 0) {
            toast.error("Your balance is low", {
              position: "top-right",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            // Wallet balance is sufficient, proceed with sending money
            // The sendMoney function code you provided here
            // ...
           
            toast.warning(`Wallet balance is sufficient ₦ ${wallet}`, {
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
        } else {
          // Handle the case when wallet is null
        
         
        }
        
        setIsLoading1(true);
        var userid = localStorage.getItem("userid");
        var token = localStorage.getItem("token");
        var data = new FormData();
      
        if (userid && token) {
          data.append("sender_email", email);
          data.append("receiver_email", recieveremail);
          data.append("amount", sendamount);
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Wallet/sendMoney`, {
              method: 'POST',
              headers: {
                "Authorization": `Bearer ${token}`
              },
              body: data,
            });
      
            const responseData = await response.json();
      
            if (responseData.code === 200) {
              setMessage(responseData.message);
              
            } else {
              // setMessage('Failed to send money.');
              
              toast.error(`Failed to send money.`, {
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
            // setMessage('Error occurred while sending money.');
           
            toast.error(`Error occurred while sending money.`, {
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
        } else {
          // setMessage('User ID or token is missing.');
          
          toast.info(`User ID or token is missing.`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setIsLoading1(false);
        }
      };
    
      const handleUseremailChange = (e) => {
        setEmail(e.target.value);
      
      };
    
      const handleSendAmountChange = (e) => {
        setSendamount(e.target.value);
      };

      const handlerecieverChange = (e) => {
        setRecieveremail(e.target.value);
      };
    
  return (
      
         <div >
             <Card title="Pay Businesses">
        <div className="space-y-3">
          <Textinput
            label="Amount"
            id="amount"
            type="text"
            placeholder="Enter Amount"
            onChange={handleSendAmountChange}
            value={sendamount}
          />
          <Textinput
            label=" Recipient Email"
            id="Reciever"
            type="email"
            placeholder="Enter Reciever's email"
            onChange={handlerecieverChange}
             value={recieveremail}
            
          />
          <input
            label=" sender_email"
            id="InvalidState"
            type="text"
            onChange={handleUseremailChange}
            hidden
            value={email}  
          />
        </div>
<br/>
        <div className="flex justify-between">
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">
                    Total amount
                  </span>
                  <span className="text-lg font-medium text-slate-900 dark:text-white block">
                  {wallet !== null ? naira.format(parseFloat(wallet)) : 'N/A'}
                  </span>
                </div>
                <br/>
                <div>
                {showWithdrawButton ? (
                 
                  <button
             className="btn btn-dark" 
            onClick={send_bizMoney}
            disabled={!recieveremail || !email || !sendamount || isLoading1}
          >
            {isLoading1 ? 'Please wait...' : 'Send'}
          </button>

                 
 ) : (

     ""
  )}

  </div>
  </div>
      </Card>
         </div>
  );
};

export default BalnkPage;
