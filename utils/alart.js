import { toast } from "react-toastify";


export const _notifySuccess = (msg) => toast(msg, {
    type: "success",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
})

export const _notifyError = (msg) => toast(msg, {
    type: "error",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
})

export const _notifyWarn = (msg) => toast(msg, {
    type: "warning",
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
})




export const Naira = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });



//   {new Date(transaction.timestamp).toLocaleString('en-US', {
//     timeZone: 'PST',
//     hour12: true,
//     timeStyle: 'short',
//     dateStyle: 'long',
//   })}
