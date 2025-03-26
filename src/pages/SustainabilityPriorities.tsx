
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MainContent from "@/components/sustainability-priorities/MainContent";

const SustainabilityPriorities = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default SustainabilityPriorities;
