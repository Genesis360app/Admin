"use client";

import AllProducts from "@/components/partials/table/AllProducts";
import ProductBredCurbs from "@/components/partials/ProductBredCurbs";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("@/components/ui/Carousel"), {
  ssr: false,
});

import { SwiperSlide } from "swiper/react";
import Card from "@/components/ui/Card";

const Products = () => {


    
  return (
    <div className="space-y-5 ">
      <ProductBredCurbs title="Products" />
      <Card>
        <Carousel pagination={true} navigation={true} className="main-caro">
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c1.png)`,
              }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c2.png)`,
              }}
            ></div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c3.png)`,
              }}
            ></div>
          </SwiperSlide>
        </Carousel>
      </Card>
    
   
      <AllProducts />
    </div>
    
  );
};

export default Products;
