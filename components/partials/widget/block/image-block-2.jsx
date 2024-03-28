import React, {useEffect, useState,useCallback} from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/services/users.service";
const ImageBlock2 = () => {
  const date = new Date();
  const hour = date.getHours();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await userService.fetchProfile(); // Call fetchUsers as a function
  
        if (response) {
          // console.log(response); // Use response.data
          setUsername(response.data.user.username);
        } else {
          // Handle case where response or response.data is undefined
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      className="bg-no-repeat bg-cover bg-center p-5 rounded-[6px] relative"
      style={{
        backgroundImage: `url(/assets/images/all-img/widget-bg-2.png)`,
      }}
    >
    
      <div>
        <h4 className="text-xl font-medium text-white mb-2">
          
          {hour >= 12
    ? hour >= 16
      ? <span className="block font-normal">Good evening,</span>
      : <span className="block font-normal">Good Afternoon</span>
    :  <span className="block font-normal">Good Morning</span>
    }
          <span className="block">{username}</span>
        </h4>
        <p className="text-sm text-white font-normal">Welcome to Genesis360</p>
      </div>
    </div>
  );
};

export default ImageBlock2;
