
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DiscussionsContent from "@/components/sustainability-discussions/DiscussionsContent";

const SustainabilityDiscussions = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <DiscussionsContent />
      <Footer />
    </div>
  );
};

export default SustainabilityDiscussions;
