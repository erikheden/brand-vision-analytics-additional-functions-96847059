
import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import ImpactCategoryFilter from "./ImpactCategoryFilter";
import ImpactYearFilter from "./ImpactYearFilter";
import ImpactLevelFilter from "./ImpactLevelFilter";

interface ImpactFiltersProps {
  selectedCountry: string;
  countries: string[];
  handleCountryChange: (country: string) => void;
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  years: number[];
  selectedYear: number | null;
  setSelectedYear: (year: number) => void;
  sortedImpactLevels: string[];
  selectedLevels: string[];
  toggleImpactLevel: (level: string) => void;
  isLoading: boolean;
}

const ImpactFilters: React.FC<ImpactFiltersProps> = ({
  selectedCountry,
  countries,
  handleCountryChange,
  categories,
  selectedCategories,
  toggleCategory,
  years,
  selectedYear,
  setSelectedYear,
  sortedImpactLevels,
  selectedLevels,
  toggleImpactLevel,
  isLoading
}) => {
  return (
    <>
      {/* Country Selection Card */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <h2 className="text-lg font-semibold text-[#34502b] mb-3">Active Country</h2>
        <p className="text-gray-600 text-sm mb-4">
          Select which country to view detailed impact data for
        </p>
        <CountryButtonSelect 
          selectedCountry={selectedCountry}
          countries={countries} 
          onCountryChange={handleCountryChange}
        />
      </Card>
      
      {selectedCountry && (
        <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Category Filter */}
            <div className="md:w-1/3">
              <ImpactCategoryFilter 
                categories={categories} 
                selectedCategories={selectedCategories} 
                toggleCategory={toggleCategory} 
                isLoading={isLoading} 
              />
            </div>
            
            {/* Year Filter */}
            <div className="md:w-1/3">
              <ImpactYearFilter 
                years={years} 
                selectedYear={selectedYear} 
                setSelectedYear={setSelectedYear} 
                isLoading={isLoading} 
              />
            </div>
            
            {/* Impact Level Filter */}
            <div className="md:w-1/3">
              <ImpactLevelFilter 
                sortedImpactLevels={sortedImpactLevels} 
                selectedLevels={selectedLevels} 
                toggleImpactLevel={toggleImpactLevel} 
                isLoading={isLoading} 
              />
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ImpactFilters;
