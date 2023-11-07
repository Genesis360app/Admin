"use client";

import React, { Fragment } from "react";
import useDarkMode from "@/hooks/useDarkMode";
import Link from "next/link";
import useWidth from "@/hooks/useWidth";

const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link href="/ecommerce">
        <React.Fragment>
          {width >= breakpoints.xl ? (
            <img
              src={
                isDark
                  ? "/assets/images/logo/logo.png "
                  : "/assets/images/logo/logo.png"
              }
              alt=""
              className="w-10" 
            />
          ) : (
            <img
              src={
                isDark
                  ? "/assets/images/logo/logo.png"
                  : "/assets/images/logo/logo.png"
              }
              alt=""
              className="w-10" 
            />
          )}
        </React.Fragment>
      </Link>
    </div>
  );
};

export default Logo;
