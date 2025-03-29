
import React from "react";
import ImpactCategoriesContent from "@/components/materiality-areas/ImpactCategoriesContent";

const SustainabilityImpact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-[#34502b] mb-6">Sustainability Impact Categories</h1>
        <p className="text-gray-600 mb-6">
          Explore how sustainability impacts consumer behavior across different industries and years.
        </p>
        <ImpactCategoriesContent />
      </div>
    </div>
  );
};

export default SustainabilityImpact;
