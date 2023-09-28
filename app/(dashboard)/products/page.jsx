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
      <Card title="Product Banner">
        <Carousel
          pagination={true}
          navigation={true}
          className="main-caro"
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c1.png)`,
              }}
            >
                <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c2.png)`,
              }}
            >

            <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div
              className="single-slide bg-no-repeat bg-cover bg-center rounded-md min-h-[300px] "
              style={{
                backgroundImage: `url(/assets/images/all-img/c3.png)`,
              }}
            >
                <div className="pt-20 container text-center px-4 slider-content h-full w-full min-h-[300px] rounded-md flex flex-col items-center justify-center text-white">
                <div className="max-w-sm">
                  <h2 className="text-xl font-medium text-white">
                    Lorem ipsum
                  </h2>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit.Lorem ipsum dolor sit amet, consectetur..
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Carousel>
      </Card>
    
   
      <AllProducts />
    </div>
    
  );
};

export default Products;
