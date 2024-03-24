"use client";
import React, { useState, useEffect, Fragment } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@/components/ui/Select";
import { authService } from "@/services/auth.services";
import * as yup from "yup";
import { _notifySuccess, _notifyError } from "@/utils/alart";
import { CircularProgress } from "@mui/material";
import { useFormik } from "formik";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  firstname: yup.string().required("First Name is required"),
  lastname: yup.string().required("Last Name is required"),
  rcNumber: yup.string().optional(),
  business_name: yup.string().required("Business name is required"),
  business_address: yup.string().required("Business address is required"),
  business_category: yup.string().required("Business category is required"),
  phone: yup
    .string()
    .required("Phone Number is required")
    .min(10, "Phone Number must be at least 10 characters")
    .max(10, "Phone Number must be at most 10 characters"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "Password must be minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  confirmedNewPass: yup
    .string()
    .required("Confirm password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters")
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
  isBusiness: yup.boolean().default(true),
  isRegistered: yup
    .boolean()
    .required("Please select if business is registered"),
  referralCode: yup.string().optional(),
});

const AccountPage = () => {
  const [check, setCheck] = useState(true);
  const toggle = () => {
    setCheck(!check);
  };
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUpSubmit = async (values) => {
    try {
      const response = await authService.register(
        values.username,
        values.firstname,
        values.lastname,
        values.password,
        values.email,
        values.phone,
        values.rcNumber,
        values.isBusiness,
        values.isRegistered,
        values.referralCode,
        values.business_name,
        values.business_address,
        values.business_category
      );
      if (response) {
        _notifySuccess(response.message);
        // handleOtpModal(response.data.id);
      } else {
        _notifyError("Registration failed. Please try again.");
      }
    } catch (err) {
      // console.error("Error during registration:", err);
    }
  };

  const {
    handleSubmit: handleSignUp,
    handleChange,
    handleBlur,
    values,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      phone: "",
      rcNumber: "",
      isBusiness: true,
      isRegistered: false,
      referralCode: "",
      business_name: "",
      business_address: "",
      business_category: "",
      confirmedNewPass: "", // Added for password confirmation
      agreement: false, // Added for agreement checkbox
    },
    validationSchema: schema,
    onSubmit: handleSignUpSubmit,
  });

  // customer account
  const [firstname1, setFirstname1] = useState("");
  const [lastname1, setLastname1] = useState("");
  const [email1, setEmail1] = useState("");
  const [password1, setPassword1] = useState("");
  const [confirmedNewPass1, setConfirmedNewPass1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [ref_id1, setRef_id1] = useState("");
  const [username1, setUsername1] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
  };

  async function handleCustomer(e) {
    e.preventDefault();
    setIsLoading1(true);

    try {
      var form = new FormData();
      form.append("email", email1);
      form.append("phone", phone1);
      form.append("username", username1);
      form.append("last_name", lastname1);
      form.append("first_name", firstname1);
      form.append("password", password1);
      form.append("ref_id", ref_id1);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/Register.php`,
        {
          method: "POST",
          body: form,
        }
      );

      const data_ = await response.json();

      if (data_.code === 200) {
        toast.success(data_.message, {
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
          window.location.reload();
        }, 2000);
        setIsLoading1(false);
      } else {
        toast.error(data_.message, {
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
      // Handle any errors here
      //   console.error(error);
      toast.error(error, {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading1(false);
    }
  }

  // async function handleBusiness(e) {
  //   e.preventDefault();
  //   setIsLoading(true);

  //   try {
  //     var datas = new FormData();
  //     datas.append("email", email);
  //     datas.append("phone", phone);
  //     datas.append("username", username);
  //     datas.append("last_name", lastname);
  //     datas.append("first_name", firstname);
  //     datas.append("password", password);
  //     datas.append("ref_id", ref_id);
  //     datas.append("business_category", business_category);
  //     datas.append("business_name", business_name);
  //     datas.append("business_address", business_address);
  //     datas.append("isRegistered", isRegistered);
  //     datas.append("rcNumber", rcNumber);

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/Auth/RegisterBusiness`,
  //       {
  //         method: "POST",
  //         body: datas,
  //       }
  //     );

  //     const data_ = await response.json();

  //     if (data_.code === 200) {
  //       toast.success(data_.message, {
  //         position: "top-right",
  //         autoClose: 1500,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });

  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 2000);
  //     } else {
  //       toast.error(data_.message, {
  //         position: "top-right",
  //         autoClose: 1500,
  //         hideProgressBar: false,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //         theme: "light",
  //       });
  //     }
  //   } catch (error) {
  //     // Handle any errors here
  //     //   console.error(error);
  //     toast.error(error, {
  //       position: "top-right",
  //       autoClose: 1500,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <div>
      <ToastContainer />
      <div className="flex justify-between mb-6">
        <h4 className="text-slate-900 text-xl font-medium">
          Create a new users Account
        </h4>
        <label className="inline-flex text-sm cursor-pointer">
          <input type="checkbox" onChange={toggle} hidden />
          <span
            className={`${
              check
                ? "bg-slate-900 dark:bg-slate-900 text-white"
                : "dark:text-slate-300"
            } 
            px-[18px] py-1 transition duration-100 rounded`}
          >
            Customers
          </span>
          <span
            className={`
            ${
              !check
                ? "bg-slate-900 dark:bg-slate-900 text-white"
                : " dark:text-slate-300"
            }
            px-[18px] py-1 transition duration-100 rounded
            `}
          >
            Business
          </span>
        </label>
      </div>

      {check ? (
        <Card title="Customers Account">
          <form>
            <div className="space-y-4">
              <Textinput
                label="First Name"
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter first name "
                required
                onChange={(e) => {
                  setFirstname1(e.target.value);
                }}
              />
              <Textinput
                label="Last Name"
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter last name "
                required
                onChange={(e) => {
                  setLastname1(e.target.value);
                }}
              />

              <Textinput
                label="Username"
                id="username"
                name="username"
                type="text"
                placeholder="Type your Username"
                required
                onChange={(e) => {
                  setUsername1(e.target.value);
                }}
              />
              <Textinput
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Type your email"
                required
                onChange={(e) => {
                  setEmail1(e.target.value);
                }}
              />
              <Textinput
                label="Phone Number"
                id="phone"
                name="phone"
                type="phone"
                placeholder="Type your phone number"
                required
                onChange={(e) => {
                  setPhone1(e.target.value);
                }}
              />
              <Textinput
                label="Referral Code optional"
                id="ref_id"
                name="ref_id"
                type="text"
                required
                placeholder="Enter referral code"
                onChange={(e) => {
                  setRef_id1(e.target.value);
                }}
              />
              <Textinput
                label="Password"
                id="password"
                name="password"
                type={passwordVisibility ? "text" : "password"}
                required
                placeholder="8+ characters, 1 capital letter"
                endAdornment={
                  <span
                    className="cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisibility ? (
                      <Icon icon="heroicons:eye" />
                    ) : (
                      <Icon icon="heroicons:eye" />
                    )}
                  </span>
                }
                onChange={(e) => {
                  setPassword1(e.target.value);
                }}
              />
              <Textinput
                label="Confirm Password"
                id="confirm_new_password"
                name="confirm_new_password"
                type={passwordVisibility ? "text" : "password"}
                required
                placeholder="8+ characters, 1 capital letter"
                endAdornment={
                  <span
                    className="cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisibility ? (
                      <Icon icon="heroicons:eye" />
                    ) : (
                      <Icon icon="heroicons:eye" />
                    )}
                  </span>
                }
                onChange={(e) => {
                  setConfirmedNewPass1(e.target.value); // Store the confirmed password
                }}
              />
              <div className=" space-y-4">
                <Button
                  type="submit"
                  className="btn-dark"
                  onClick={handleCustomer}
                  disabled={password1 !== confirmedNewPass1 || isLoading1}
                >
                  {isLoading ? "Please wait..." : "Create Account"}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      ) : (
        <Card title="Business Account">
          <form onSubmit={handleSignUp}>
            <div className="space-y-4">
              <Textinput
                label="First Name"
                id="firstname"
                name="firstname"
                type="text"
                placeholder="Enter first name "
                value={values.firstname}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.firstname && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.firstname}
                </p>
              )}
              <Textinput
                label="Last Name"
                id="lastname"
                name="lastname"
                type="text"
                placeholder="Enter last name "
                value={values.lastname}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.lastname && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.lastname}
                </p>
              )}
              <Textinput
                label="Username"
                id="username"
                name="username"
                type="text"
                placeholder="Type your Username"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.username}
                </p>
              )}
              <Textinput
                label="Email"
                id="email"
                name="email"
                type="email"
                placeholder="Type your email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.email}
                </p>
              )}
              <Textinput
                label="Phone Number"
                id="phone"
                name="phone"
                type="phone"
                placeholder="Type your phone number"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.phone}
                </p>
              )}

              <div className="mt-[30px]">
                <label
                  htmlFor="Business Registered"
                  className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
                >
                  Registered?
                </label>
                <select
                  id="isRegistered"
                  name="isRegistered"
                  value={String(values.isRegistered)}
                  onChange={(e) => {
                    handleChange(e);
                    // console.log("Selected option:", e.target.value);
                  }}
                  onBlur={handleBlur}
                  className="form-control py-2  appearance-none"
                >
                  <option value="">Is this business registered?</option>
                  {Registered.map((option) => (
                    <option
                      key={String(option.value)}
                      value={String(option.value)}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.isRegistered && (
                  <p className="text-danger-800 text-md my-1.5 font-semibold">
                    {errors.isRegistered}
                  </p>
                )}
              </div>

              <Textinput
                // label="isBusiness "
                id="isBusiness"
                type="text"
                name="isBusiness"
                value={String(values.isBusiness)}
                onChange={(e) => {
                  handleChange(e);
                  // console.log("isBusiness option:", e.target.value);
                }}
                onBlur={handleBlur}
                disabled={isSubmitting}
                className="hidden"
              />

              {String(values.isRegistered) === "true" && (
                <>
                  <Textinput
                    label="Reg_Number"
                    id="rcNumber"
                    name="rcNumber"
                    value={values.rcNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  {errors.rcNumber && (
                    <p className="text-danger-800 text-md my-1.5 font-semibold">
                      {errors.rcNumber}
                    </p>
                  )}
                </>
              )}

              <Textinput
                label="Business Name"
                id="business_name"
                name="business_name"
                type="text"
                placeholder={"John Hoe Supermarkket"}
                value={values.business_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.business_name && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.business_name}
                </p>
              )}

              <div className="mt-[30px]">
                <label
                  htmlFor="Business category"
                  className="block capitalize form-label mr-6 md:w-[100px] w-[60px] break-words leading-[25px] mb-2"
                >
                  Business Category *
                </label>
                <select
                  id="business_category"
                  name="business_category"
                  value={values.business_category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className="form-control py-2  appearance-none"
                >
                  <option value="">Select Business Category</option>
                  {bizcategory.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.business_category && (
                  <p className="text-danger-800 text-md my-1.5 font-semibold">
                    {errors.business_category}
                  </p>
                )}
              </div>

              <Textinput
                label="Business Address"
                id="business_address"
                name="business_address"
                placeholder="Business address"
                value={values.business_address}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />
              {errors.business_address && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.business_address}
                </p>
              )}
              <Textinput
                label="Referral Code optional"
                id="referralCode"
                name="referralCode"
                placeholder="referral code"
                value={values.referralCode}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
              />

              {errors.referralCode && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.referralCode}
                </p>
              )}

              <Textinput
                label="Password"
                id="password"
                name="password"
                type={passwordVisibility ? "text" : "password"}
                placeholder="Enter password"
                endAdornment={
                  <span
                    className="cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisibility ? (
                      <Icon icon="heroicons:eye" />
                    ) : (
                      <Icon icon="heroicons:eye" />
                    )}
                  </span>
                }
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.password}
                </p>
              )}

              <Textinput
                label="Confirm Password"
                id="confirmedNewPass"
                name="confirmedNewPass"
                type={passwordVisibility ? "text" : "password"}
                placeholder="Enter password"
                endAdornment={
                  <span
                    className="cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisibility ? (
                      <Icon icon="heroicons:eye" />
                    ) : (
                      <Icon icon="heroicons:eye" />
                    )}
                  </span>
                }
                value={values.confirmedNewPass}
                onChange={handleChange}
                onBlur={handleBlur}
              />

              {errors.confirmedNewPass && (
                <p className="text-danger-800 text-md my-1.5 font-semibold">
                  {errors.confirmedNewPass}
                </p>
              )}
              <div className=" space-y-4">
                <Button
                  type="submit"
                  className="btn-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress color="inherit" size={24} />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

const bizcategory = [
  { value: "Hotel", label: "Hotel" },
  { value: "Startups", label: "Startups" },
  { value: "Hospital", label: "Hospital" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Boarding School", label: "Boarding School" },
  { value: "Corporate Enterprise", label: "Corporate Enterprise" },
  { value: "Financial Institution", label: "Financial Institution" },
];

const Registered = [
  { value: true, label: "Yes" },

  { value: false, label: "No" },
];

export default AccountPage;
