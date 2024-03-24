import axios, { AxiosResponse } from "axios";
import { _notifySuccess, _notifyError,_notifyWarn } from "@/utils/alart";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchUsers = async () => {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/users`,
        {
          
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

  const fetchProfile = async () => {
    try {
      const userString = localStorage.getItem("user");
  
      if (!userString) {
        throw 'User token not found';
      }
  
      const user = JSON.parse(userString);
  
      if (!user || !user.token || !user.userId) {
        throw 'Invalid user data';
      }
  
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user.userId}`,
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
        throw error.response?.data ||  handleApiError(error);;
      } else {
        throw 'An unexpected error occurred';
      }
    }
  };
  
  const totalCustomer = async () => {
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
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/get/count`,
        {
          
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
  export  const userService = {
    fetchUsers,
    fetchProfile,
    totalCustomer,
    };
    
// export default userService;