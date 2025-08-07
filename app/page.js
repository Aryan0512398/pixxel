import FeaturesSection from "@/components/FeaturesSection";
import HeroSection from "@/components/hero";
import Pricing from "@/components/pricing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const stats = [
    {
      label: "Images Processed",
      value: 10000,
      suffix: "+",
    },
     {
      label: "Active Users",
      value: 500,
      suffix: "+",
    },
     {
      label: "AI  Transformations",
      value: 45000,
      suffix: "+",
    },
     {
      label: "User Satisfaction",
      value: 97,
      suffix: "%",
    },
  ];
  return (
    <div className="pt-36">
      <HeroSection></HeroSection> {/* Hero */}
      {/* stats */}
      <section>
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >{stats.map((stat, index)=>{
            return (
              <div className="text-center mb-8" key={index}>
               <div className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {stat.value.toLocaleString()} {stat.suffix}
               </div>
               <div className="text-gray-400 text-sm uppercase tracking-wider">
                 {stat.label}
               </div>
              </div>
            );
          })}</div>
        </div>
      </section>
      {/* features */}
      <FeaturesSection></FeaturesSection>
      {/* pricing */}
      <Pricing/>
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl font-bold mb-6">
            Ready to{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Create Something Amazing
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join Thousands of creators who are already using AI to transform
            their images and their vision to life
          </p>
          <Link href="/dashboard">
            <Button variant="primary" size="xl">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
