
import React from "react";
import ImpactCategoriesContent from "@/components/materiality-areas/ImpactCategoriesContent";

const SustainabilityImpact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold text-[#34502b] mb-6">Sustainability Impact Categories</h1>
        <div className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
          <p className="text-gray-600">
            Compare sustainability impacts across different categories and years. Select multiple categories to see how they compare, and filter by impact level to focus on specific aspects.
          </p>
        </div>
        <ImpactCategoriesContent />
      </div>
    </div>
  );
};

export default SustainabilityImpact;
