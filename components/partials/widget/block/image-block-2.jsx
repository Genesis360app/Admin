import React, {useEffect, useState,useCallback} from "react";
import { useRouter } from "next/navigation";

const ImageBlock2 = () => {
  const date = new Date();
  const hour = date.getHours();
  const [loggedIn, setLoggedIn] = useState(false);
  const [firstname, setFirstname] = useState("");
  const router = useRouter();

  useEffect(() => {
    var userid = localStorage.getItem("userid");
    var token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/User/getUser.php?userid=${userid}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then((res) => {
        // console.log(res);
        if (res.code === 200) {
          setFirstname(res.user.first_name);
          setLoggedIn(true);
        } else if (res.code === 401) {
          toast.error(res.message, {
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
            router.push("/login");
          }, 1500);
          // Handle unauthorized error...
        }
      });
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
          <span className="block">{firstname}</span>
        </h4>
        <p className="text-sm text-white font-normal">Welcome to Genesis360</p>
      </div>
    </div>
  );
};

export default ImageBlock2;
