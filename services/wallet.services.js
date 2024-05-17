import axios, { AxiosResponse } from "axios";
import { _notifySuccess, _notifyError,_notifyWarn } from "@/utils/alart";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchTransactions = async (page, limit) => {
    try {
      const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error('User token not found');
        }
    
        const user = JSON.parse(userString);
    
        if (!user || !user.token || !user.userId) {
          throw new Error('Invalid user data');
        }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/transaction`,
        {
          params: {
            page: page,
            limit: limit,
          },
          headers: {
            // cache: 'no-store',
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
  
        // console.log(response.data);
      }
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ||handleApiError; // Include error.message for unexpected errors
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };
const fetchLoans = async (page, limit) => {
    try {
      const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error('User token not found');
        }
    
        const user = JSON.parse(userString);
    
        if (!user || !user.token || !user.userId) {
          throw new Error('Invalid user data');
        }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/loan/all`,
        {
          params: {
            page: page,
            limit: limit,
          },
          headers: {
            // cache: 'no-store',
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
  
        // console.log(response.data);
      }
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ||handleApiError; // Include error.message for unexpected errors
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };

  const getBankAccount = async (
    bvn) => {
    try {

      const userString = localStorage.getItem("user");
      if (!userString) {
        throw new Error('User token not found');
      }
  
      const user = JSON.parse(userString);
  
      if (!user || !user.token || !user.userId) {
        throw new Error('Invalid user data');
      }
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/generate-wallet`,
        {
          bvn,
          
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data) {
        
      }
  
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.error('Axios Error:', error);
        throw error.response?.data || 'Internal Server Error';
      } else {
        // console.error('Unexpected Error:', error);
        throw 'An unexpected error occurred';
      }
    }
  };
  const getWallet = async () => {
    try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          throw new Error('User token not found');
        }
    
        const user = JSON.parse(userString);
    
        if (!user || !user.token || !user.userId) {
          throw new Error('Invalid user data');
        }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/user-wallet`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );
  
      if (response) {
        // console.log(response);

      }
  
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error.response?.data ||handleApiError; // Include error.message for unexpected errors
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };
  const handleApiError = (error) => {
    if (axios.isAxiosError(error)) {
      const response  = error.response;
  
      if (response) {
        // Handle specific status codes or error messages here
        if (response.status === 401) {
          // Unauthorized error handling
          _notifyError("Unauthorized user, please check your credentials");
        } else if (response.status === 404) {
          // Not Found error handling
          _notifyError("Not Found, please check your credentials");
        } else {
          // Handle other status codes or error messages
          _notifyError("Error, please try again");
        }
      } else {
        // Network error handling
        if (!navigator.onLine) {
          // Use a timer to trigger the network error notification after a delay
          setTimeout(() => {
            toast.warning("Network is offline. Please check your internet connection");
          }, 2000);
        } else {
          _notifyError("An unexpected error occurred");
        }
      }
    } else {
      // Handle other types of errors
      _notifyError("An unexpected error occurred");
    }
  };
  export const walletService = {
    fetchTransactions,
    getBankAccount,
    getWallet,
    fetchLoans,

    };
    
// export default userService;