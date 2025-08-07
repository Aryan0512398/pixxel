"use client";
import React, { useState } from "react";
import UserInterfaceObserver from "./user-interface-observer";

function FeatureCard({ icon, title, description, delay }) {
  const [ref, isVisible] = UserInterfaceObserver();
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      ref={ref}
      className={`backdrop-blur-lg p-6 bg-white/5 border-white/10  rounded-2xl transition-all duration-700 cursor-pointer ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${isHovered ? "transform shadow-2xl scale-105 rotate-1" : "scale-100"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default FeatureCard;
