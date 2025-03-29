
import React from "react";
import ImpactCategoriesContent from "@/components/materiality-areas/ImpactCategoriesContent";

const SustainabilityImpact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Impact Categories</h1>
        <ImpactCategoriesContent />
      </div>
    </div>
  );
};

export default SustainabilityImpact;
