import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper";
import "swiper/css";
import "swiper/css/effect-cards";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "@/components/ui/Icon";
import { walletService } from "@/services/wallet.services";
import * as yup from "yup";
import Textinput from "@/components/ui/Textinput";
import { useFormik } from "formik";
import { Naira } from "@/utils/alart";
import { motion } from "framer-motion";
const generateaccount = yup.object().shape({
  bvn: yup
    .string()
    .required("BVN is required")
    .min(11, "BVN must be at least 11 characters")
    .max(11, "BVN must be at most 11 characters"),
});

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
  const [balance, setBalance] = useState(null);
  const [account_name, setAccount_name] = useState("");
  const [account_number, setAccount_number] = useState("");
  const [bank, setBank] = useState("");
  const [status, setStatus] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    var token = localStorage.getItem("token");
    var userid = localStorage.getItem("userid");
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.json())
      .then((res) => {
        // console.log(res);
        if (res.code === 200) {
          setWallet(res.user.wallet);
          setBank_name(res.user.bank_name);
        }
      });
  }, []);


  const handleGenerateCard = () => {
    setIsLoading(true);
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    var payload = new FormData();
    fetch(
      `https://gen360-finance.onrender.com/api/v2/wallets/topup/${userid}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: payload,
      }
    )
      .then((response) => response.json())
      .then((data) => {
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
      .catch((error) => {
        // Handle other errors
        console.error(error);
      });
  };




  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
    setValues,
  } = useFormik({
    initialValues: {
      bvn: "",
    },
    validationSchema: generateaccount,

    onSubmit: async (values) => {
      try {
        const response = await walletService.getBankAccount(values.bvn);
        if (response) {
          // console.log(response);
          setTimeout(() => {
            window.location.reload();
          }, 5000);
          _notifySuccess(response.message);
        } else {
          _notifyError(" failed to add address book. Please try again.");
        }
      } catch (err) {
        // console.error("Error during registration:", err);
        setError(err.message);
      }
    },
  });

  useEffect(() => {
    // Clear error message after 2 seconds
    const timeoutId = setTimeout(() => {
      setError("");
    }, 4000);

    // Clear the timeout if the component is unmounted or if the error changes
    return () => clearTimeout(timeoutId);
  }, [error]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await walletService.getWallet();

        if (response.status === 200) {
          const userData = response.data;
          const walletStatus = response.status;
          setStatus(walletStatus);
          setAccount_name(userData.accountName);
          setAccount_number(userData.accountNo);
          setBank(userData.bankName);
          setBalance(userData.balance);
        } else {
          _notifyError("Account not available");
        }
      } catch (err) {
        // console.error("Error:", err);
      }
    };
    fetchData();
  }, []);



  async function copyTextToClipboard(text) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
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
      {parseInt(status) === 200 ? (
      <Swiper effect={"cards"} grabCursor={true} modules={[EffectCards]}>
        {cardLists.map((item, i) => (
          <SwiperSlide key={i}>
            <div
              className={`${item.bg} h-[200px] bg-gradient-to-r relative rounded-md z-[1] p-4 text-white`}
              style={{ position: "relative" }}
            >
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
              <div className="text-xs text-bold text-opacity-75 mb-[2px]">
                {bank}
              </div>
              <div className="mt-[8px] font-semibold text-lg mb-[10px]">
                {account_number}
              </div>
              <div className="text-xs text-bold text-opacity-75 mb-[2px]">
                {account_name}
              </div>
              <div className="text-xs text-opacity-75 mb-[2px]">
                Card balance
              </div>
              <div className="text-2xl font-semibold">
                {balance !== null ? Naira.format(parseFloat(balance)) : "₦0.00"}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        
      
      ) : ( 
        <>
        <div className="bg-slate-100 dark:bg-slate-900 rounded-md p-4">
        <span
          className="text-xs text-slate-500 dark:text-slate-400 block mb-1 cursor-pointer font-normal"
          htmlFor="bvn"
        >
          Bank Verification Number
        </span>
        <Textinput
          name="bvn"
          placeholder="Enter Bvn number"
          value={values.bvn}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isSubmitting}
          id="bvn"
          className="bg-transparent border-none focus:ring-0 focus:border-none p-0 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 placeholder:font-medium  h-auto font-medium"
        />
        {errors.bvn && (
          <p className="text-danger-800 text-md my-1.5 font-semibold">
            {errors.bvn}
          </p>
        )}

        {error && (
                <motion.div
                  animate={{ y: 10 }}
                  transition={{ delay: 0.5 }}
                  className=" bg-indigo-900 text-center py-2 lg:px-4 "
                >
                  <div
                    className="p-2 bg-danger-300 items-center rounded-md text-danger-800 leading-none  flex lg:inline-flex"
                    role="alert"
                  >
                    <span className="flex rounded-full bg-danger-400 uppercase px-2 py-1 text-xs font-bold mr-3">
                      New
                    </span>
                    <span className="font-semibold mr-2 text-left flex-auto">
                      {error}
                    </span>
                    <svg
                      className="fill-current opacity-75 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
                    </svg>
                  </div>
                </motion.div>
              )}
      </div>
<center>
<button  className="btn btn-dark mt-4 text-primary-500 justify-center items-center " 
      disabled={isSubmitting}
       type="submit" onClick={handleSubmit}
      >
                {isSubmitting ? "Generating..." : "Generate"}
            </button>
</center>
     

        </>
    
       
            )}
    
    </div>
  );
};

export default CardSlider;
