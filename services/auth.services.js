import axios, { AxiosResponse } from "axios";
import { _notifySuccess, _notifyError,_notifyWarn } from "@/utils/alart";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, {
        email,
        password,
        
      });
      
  
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
  
      console.log(response.data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const register = async (
    username,
    firstname,
    lastname,
    password,
    email,
    phone,
    rcNumber,
    isBusiness,
    isRegistered,
    referralCode,
    business_name,
    business_address,
    business_category,
  ) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, {
        username,
        firstname,
        lastname,
        email,
        password,
        phone,
        rcNumber,
        isBusiness,
        isRegistered,
        referralCode,
        business_name,
        business_address,
        business_category,
      });
  
      if (response) {
        // localStorage.setItem('user', JSON.stringify(response.data));
      }
  
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
  };
  
  const getCurrentUser = () => {
    const userString = localStorage.getItem("user");
  
    if (!userString) {
      return null;
    }
  
    return JSON.parse(userString);
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

  export const  authService = {
  login,
  logout,
  getCurrentUser,
  register,
};