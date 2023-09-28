"use client";
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const tables = [
  {
    title: "Advanced",
    price_Yearly: "$96",
    price_Monthly: "$26",
    button: "Buy now",
    bg: "bg-warning-500",
    img: "/assets/images/all-img/big-shap1.png",
  },
  {
    title: "Business",
    price_Yearly: "$196",
    price_Monthly: "$20",
    button: "Buy now",
    bg: "bg-info-500",
    ribon: "Most popular",
    img: "/assets/images/all-img/big-shap2.png",
  },
  {
    title: "Basic",
    price_Yearly: "$26",
    price_Monthly: "$16",
    button: "Try it free",
    bg: "bg-success-500",
    img: "/assets/images/all-img/big-shap3.png",
  },
  {
    title: "Got a large team?",
    price_Yearly: "$126",
    price_Monthly: "$16",
    button: "Request a quote",
    bg: "bg-primary-500",
    img: "/assets/images/all-img/big-shap4.png",
  },
];
const PricingPage = () => {
  const [check, setCheck] = useState(true);
  const toggle = () => {
    setCheck(!check);
  };

  return (
    <div>
      <div className="space-y-5">
        <Card>
         
          <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
            {tables.map((item, i) => (
              <div
                className={` ${item.bg}
          price-table bg-opacity-[0.16] dark:bg-opacity-[0.36] rounded-[6px] p-6 text-slate-900 dark:text-white relative overflow-hidden z-[1]
          `}
                key={i}
              >
                <div className="overlay absolute right-0 top-0 w-full h-full z-[-1]">
                  <img src={item.img} alt="" className="ml-auto block" />
                </div>
                {item.ribon && (
                  <div className="text-sm font-medium bg-slate-900 dark:bg-slate-900 text-white py-2 text-center absolute ltr:-right-[43px] rtl:-left-[43px] top-6 px-10 transform ltr:rotate-[45deg] rtl:-rotate-45">
                    {item.ribon}
                  </div>
                )}
                <header className="mb-6">
                  <h4 className="text-xl mb-5">{item.title}</h4>
                  <div className="space-x-4 relative flex items-center mb-5 rtl:space-x-reverse">
                    {check ? (
                      <span className="text-[32px] leading-10 font-medium">
                        {item.price_Yearly}{" "}
                      </span>
                    ) : (
                      <span className="text-[32px] leading-10 font-medium">
                        {item.price_Monthly}
                      </span>
                    )}

                    <span className="text-xs text-warning-500 font-medium px-3 py-1 rounded-full inline-block bg-white uppercase h-auto">
                      Save 20%
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-300 text-sm">
                    per user/month, annually
                  </p>
                </header>
                <div className="price-body space-y-8">
                  <p className="text-sm leading-5 text-slate-600 dark:text-slate-300">
                    Designed for teams who need to manage complex workflows with
                    more automation and integration.
                  </p>
                  <div>
                    <Button
                      text={item.button}
                      className="btn-outline-dark dark:border-slate-400 w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
       
      </div>
    </div>
  );
};

export default PricingPage;
