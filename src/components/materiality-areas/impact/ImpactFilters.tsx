
import React from "react";
import { Card } from "@/components/ui/card";
import ImpactCategoryFilter from "./ImpactCategoryFilter";
import ImpactYearFilter from "./ImpactYearFilter";
import ImpactLevelFilter from "./ImpactLevelFilter";

interface ImpactFiltersProps {
  selectedCountries: string[];
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  years: number[];
  selectedYear: number | null;
  setSelectedYear: (year: number) => void;
  impactLevels: string[];  
  selectedLevels: string[];
  toggleImpactLevel: (level: string) => void;
  isLoading: boolean;
  activeCountries?: string[];
  handleCountryChange?: (country: string) => void;
}

const ImpactFilters: React.FC<ImpactFiltersProps> = ({
  selectedCountries,
  categories,
  selectedCategories,
  toggleCategory,
  years,
  selectedYear,
  setSelectedYear,
  impactLevels, 
  selectedLevels,
  toggleImpactLevel,
  isLoading
}) => {
  return (
    <>
      {selectedCountries.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
          <h3 className="text-lg font-medium text-[#34502b] mb-4">Filter Options</h3>
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Category Filter */}
            <div className="md:w-1/3">
              <div className="bg-white p-3 rounded-lg border border-[#34502b]/10 h-full">
                <h4 className="font-medium text-[#34502b] mb-2">Categories</h4>
                <p className="text-xs text-gray-500 mb-3">Select the sustainability categories you want to analyze</p>
                <ImpactCategoryFilter 
                  categories={categories} 
                  selectedCategories={selectedCategories} 
                  toggleCategory={toggleCategory} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
            
            {/* Year Filter */}
            <div className="md:w-1/3">
              <div className="bg-white p-3 rounded-lg border border-[#34502b]/10 h-full">
                <h4 className="font-medium text-[#34502b] mb-2">Time Period</h4>
                <p className="text-xs text-gray-500 mb-3">Select the year for data analysis</p>
                <ImpactYearFilter 
                  years={years} 
                  selectedYear={selectedYear} 
                  setSelectedYear={setSelectedYear} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
            
            {/* Impact Level Filter */}
            <div className="md:w-1/3">
              <div className="bg-white p-3 rounded-lg border border-[#34502b]/10 h-full">
                <h4 className="font-medium text-[#34502b] mb-2">Impact Levels</h4>
                <p className="text-xs text-gray-500 mb-3">Filter by consumer engagement levels</p>
                <ImpactLevelFilter 
                  sortedImpactLevels={impactLevels}
                  selectedLevels={selectedLevels} 
                  toggleImpactLevel={toggleImpactLevel} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ImpactFilters;
