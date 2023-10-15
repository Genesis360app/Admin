import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@/components/ui/Icon";

const cardLists = [
  {
    bg: "from-[#1EABEC] to-primary-500 ",
    cardNo: "****  ****  **** 3945",
  },
  {
    bg: "from-[#4C33F7] to-[#801FE0] ",
    cardNo: "****  ****  **** 3945",
  },
  {
    bg: "from-[#FF9838] to-[#008773]",
    cardNo: "****  ****  **** 3945",
  },
];

const CardSlider = () => {
  const [wallet, setWallet] = useState(null);
  const [bank_name, setBank_name] = useState("");
  const [account_name, setAccount_name] = useState("");
  const [account_number, setAccount_number] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    var token = localStorage.getItem("token");
    var userid = localStorage.getItem("userid");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((res) => {
        // console.log(res);
        if (res.code === 200) {
          setWallet(res.user.wallet);
          setBank_name(res.user.bank_name);
        }
      });
  }, []);

  const naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const handleGenerateCard = () => {
    setIsLoading(true);
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    var payload = new FormData();
    fetch(`https://gen360-finance.onrender.com/api/v2/wallets/topup/${userid}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      method: "POST",
      body: payload,
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        if (data.code === 200) {
          toast.success(data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setBank_name(data.bank);
          setAccount_number(data.account_number);
          setAccount_name(data.account_name);
        } else if (data.code === 401) {
          // Handle 401 error
        }
      })
      .catch(error => {
        // Handle other errors
        console.error(error);
      });
  };


  async function copyTextToClipboard(text) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }
  
  const handleCopyClick = () => {
    if (account_number) {
      copyTextToClipboard(account_number)
        .then(() => {
          // If successful, update the isCopied state value
          toast.info("Account number copied successfully", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 1500);
        })
        .catch((err) => {
          // You can also display an error message to the user if needed
          
          toast.error(`${err}`, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
    } else {
      // You can also display an error message to the user if needed
      toast.warning("Account is null", {
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
  };
  return (
    <div className="relative">
      <ToastContainer />
      <button type="button" className="btn btn-dark" 
      onClick={ handleGenerateCard}
      disabled={isLoading}>
                Generate
            </button>
      <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]}>
        {cardLists.map((item, i) => (
          <SwiperSlide key={i}>
            
            <div className={`${item.bg} h-[200px] bg-gradient-to-r relative rounded-md z-[1] p-4 text-white`} style={{ position: 'relative' }}>
  <div className="overlay absolute left-0 top-0 h-full w-full -z-[1]">
    <img
      src="/assets/images/all-img/visa-card-bg.png"
      alt=""
      className="h-full w-full object-cover"
    />
  </div>
  <button
    type="button"
    data-value={account_number}
    onClick={handleCopyClick}
    className=" text-xl text-center font-bold text-white w-[25%] absolute top-4 right-[-35px]"
  >
    {isCopied ? (
     <Icon icon="mingcute:check-fill" />
    ) : (
      <Icon icon="solar:copy-bold" />
    )}
  </button>
  <img src="/assets/images/logo/visa.svg" alt="" />
  <div className="text-xs text-bold text-opacity-75 mb-[2px]">{bank_name}</div>
  <div className="mt-[8px] font-semibold text-lg mb-[10px]">{account_number}</div>
  <div className="text-xs text-bold text-opacity-75 mb-[2px]">{account_name}</div>
  <div className="text-xs text-opacity-75 mb-[2px]">Card balance</div>
  <div className="text-2xl font-semibold">
    {wallet !== null ? naira.format(parseFloat(wallet)) : "N/A"}
  </div>
</div>

          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardSlider;
