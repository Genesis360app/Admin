import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { handleLogin } from "./store";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const {
    
  //   formState: { errors },
  //   handleSubmit,
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: "all",
  // });

  const handleLogin = async (e) => {
    e.preventDefault();
    var data = new FormData();
    data.append("email", email);
    data.append("password", password);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Auth/Login.php`, {
        method: "POST",
        body: data
      });

      if (!response.ok) {
        toast.warning("Network response was not ok", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        throw new Error("Network response was not ok");
      }

      const res = await response.json();
        // console.log(res);
      if (res.code === 200) {
        toast.success(res.message, {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        localStorage.setItem("userid", res.user_id);
        localStorage.setItem("token", res.token);

        setTimeout(() => {
          router.push("/ecommerce");
        }, 1500);
      } else {
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
      }
    } catch (error) {
      toast.error("Check your connection", {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const [checked, setChecked] = useState(false);

  return (
    <>
        <ToastContainer/>
   
    <form onSubmit={handleLogin} className="space-y-4">
      <Textinput
        name="email"
        label="email"
        value={email}
        placeholder="Enter Email"
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-[48px]"
      />
      <Textinput
        name="password"
        label="password"
        type="password"
        value={password}
        placeholder="Enter Password"
        onChange={(e) => setPassword(e.target.value)}
        required
        className="h-[48px]"
      />
      <div className="flex justify-between">
        <Checkbox
          value={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me signed in"
        />
        <Link
          href="/forgot-password"
          className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium"
        >
          Forgot Password?{" "}
        </Link>
      </div>

      <button
        type="submit"
        className="block w-full text-center btn btn-dark"
        disabled={isLoading}
      >
        Sign in
      </button>
    </form>
 
    </>
  );
};

export default LoginForm;