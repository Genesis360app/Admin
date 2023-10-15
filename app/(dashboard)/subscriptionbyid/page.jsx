"use client";

import SubById from "@/components/partials/table/usersub";
import ProductBredCurbs from "@/components/partials/ProductBredCurbs";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/components/ui/Carousel"), {
  ssr: false,
});

import { SwiperSlide } from "swiper/react";
import Card from "@/components/ui/Card";

const SubId = () => {


    
  return (
    <div className="space-y-5 ">
      <SubById />
    </div>
    
  );
};

export default SubId;
