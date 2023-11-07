"use client";

import Allproducts from "@/components/partials/table/Allproduct";
import ProductBredCurbs from "@/components/partials/ProductBredCurbs";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/components/ui/Carousel"), {
  ssr: false,
});

import { SwiperSlide } from "swiper/react";
import Card from "@/components/ui/Card";

const All_orders = () => {
  return (
    <div className="space-y-5 ">
      <Allproducts />
    </div>
  );
};

export default All_orders;
