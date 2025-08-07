import { PricingTable } from "@clerk/nextjs";
import React from "react";
import PricingCard from "./PricingCard";

const Pricing = () => {
     const plans = [
    {
      id: "free_user",
      plan: "Free",
      price: 0,
      features: [
        "3 projects maximum",
        "20 exports per month",
        "Basic crop & resize",
        "Color adjustments",
        "Text Tool",
      ],
      buttonText: "Get Started Free",
    },
    {
      id: "pro",
      plan: "Pro",
      price: 15,
      features: [
        "Unlimited projects",
        "Unlimited exports",
        "All Editing Tools",
        "AI Background Remover",
        "AI Resize",
        "AI Scale and more",
      ],
      featured: true,
      planId: "cplan_30hRUhONQ9OEZU5G02Bd5BIhdk4",
      buttonText: "Upgrade to Pro",
    },
  ];
  return (
    <div className="py-20 px-4">
      <div className=" max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent pb-8">
            Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
           Start creating with our flexible pricing plans designed for everyone, from individuals to businesses.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {
            plans.map((plan , index)=>(
                <PricingCard key={index} {...plan}/>
            ))
        }
        </div>
      </div>
    </div>
  );
};

export default Pricing;
