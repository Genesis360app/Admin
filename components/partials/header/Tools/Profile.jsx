import React, { useState, useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogout } from "@/components/partials/auth/store";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.services";
import { _notifySuccess, _notifyError } from "@/utils/alart";

const ProfileLabel = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isSubmitting, setisSubmitting] = useState(false);

  return (
    <div className="flex items-center">
      <div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
        <div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
          <img
            src="/assets/images/all-img/main-user.png"
            alt=""
            className="block w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
          Genesis360
        </span>
        <span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
          <Icon icon="heroicons-outline:chevron-down"></Icon>
        </span>
      </div>
    </div>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSubmitting, setisSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user =authService.getCurrentUser();

        if (!user || !user.token) {
          // If user token is empty or user is not logged in, redirect to login page
          router.push("/"); // Replace "/BusinessLogin" with your actual login page path
          return; // Return early to prevent further execution
        }

        // If user is logged in, set current user and fetch profile
        setCurrentUser(user);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [router]);



  const logout = () => {
    setisSubmitting(true); // Fix the syntax error here
    authService.logout();
    _notifySuccess("Logout Successful");
    router.push ("/");
  };

  const ProfileMenu = [
    {
      label: "Profile",
      icon: "heroicons-outline:user",

      action: () => {
        router.push("/profile");
      },
    },
    {
      label: "Settings",
      icon: "heroicons-outline:cog",
      action: () => {
        router.push("/settings");
      },
    },
    {
      label: "All Users",
      icon: "heroicons-outline:credit-card",
      action: () => {
        router.push("/all_customers");
      },
    },
    {
      label: "AI Assistance",
      icon: "heroicons-outline:information-circle",
      action: () => {
        router.push("/bank_analysis");
      },
    },
    {
      label: "Logout",
      icon: "heroicons-outline:login",
      action: logout
    },
  ];

  return (
    <Dropdown label={ProfileLabel()} classMenuItems="w-[180px] top-[58px]">
      {ProfileMenu.map((item, index) => (
        <Menu.Item key={index}>
          {({ active }) => (
            <div
              onClick={() => item.action()}
              className={`${
                active
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
                  : "text-slate-600 dark:text-slate-300"
              } block     ${
                item.hasDivider
                  ? "border-t border-slate-100 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className={`block cursor-pointer px-4 py-2`}>
                <div className="flex items-center">
                  <span className="block text-xl ltr:mr-3 rtl:ml-3">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="block text-sm">{item.label}</span>
                </div>
              </div>
            </div>
          )}
        </Menu.Item>
      ))}
    </Dropdown>
  );
};

export default Profile;
