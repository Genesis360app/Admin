import React from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/logo.png";
import LogoWhite from "@/assets/images/logo/logo.png";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    <Link href="/ecommerce">
      <img src={isDark ? LogoWhite : MainLogo} alt="" className="w-10" />
    </Link>
  );
};

export default MobileLogo;
