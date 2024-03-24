import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Checkbox from "@/components/ui/Checkbox";
import Link from "next/link";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { ToastContainer } from 'react-toastify';
import { CircularProgress } from "@mui/material";
import { authService } from "@/services/auth.services";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is Required"),
    password: yup.string().required("Password is Required"),
  })
  .required();

const LoginForm = () => {
  const router = useRouter();

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,

    onSubmit: async (values) => {
      try {
        const response = await authService.login(values.email, values.password);

        if (response) {
          _notifySuccess(response.message);
          setTimeout(() => {
            router.push("/ecommerce");
          }, 1000);
        } else {
          _notifyError("Login failed please try again");
        }
      } catch (err) {
        // console.error("Error during login:", err);
      }
    },
  });

  const [checked, setChecked] = useState(false);

  return (
    <>
      <ToastContainer />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textinput
          name="email"
          label="email"
          placeholder="Enter Email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-[48px]"
        />
        {errors.email && (
          <p className="text-danger-800 text-md my-1.5 font-semibold">
            {errors.email}
          </p>
        )}
        <Textinput
          name="password"
          label="password"
          type="password"
          placeholder="Enter Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-[48px]"
        />
        {errors.password && (
                  <p className="text-danger-800 text-md my-1.5 font-semibold">
                    {errors.password}
                  </p>
                )}
        <div className="flex justify-between">
          <Checkbox
            value={checked}
            onChange={() => setChecked(!checked)}
            label="Keep me signed in"
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium leading-6 text-slate-800 dark:text-slate-400"
          >
            Forgot Password?{" "}
          </Link>
        </div>

        <button
          type="submit"
          className="block w-full text-center btn btn-dark"
          disabled={isSubmitting}
        >

        {isSubmitting ? (
                <CircularProgress color="inherit" size={25} />
              ) : (
                " Sign in"
              )}
         
        </button>
      </form>
    </>
  );
};

export default LoginForm;
