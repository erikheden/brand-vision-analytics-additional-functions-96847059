
import React from "react";
import { Card } from "@/components/ui/card";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import ImpactCategoryFilter from "./ImpactCategoryFilter";
import ImpactYearFilter from "./ImpactYearFilter";
import ImpactLevelFilter from "./ImpactLevelFilter";
import { getFullCountryName } from "@/components/CountrySelect";
import { Badge } from "@/components/ui/badge";

interface ImpactFiltersProps {
  selectedCountries: string[];
  availableCountries: string[];
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
  selectedCountries,
  availableCountries,
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
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#34502b]">Select Countries</h2>
          <p className="text-gray-600 text-sm mt-1 mb-4">
            Select one or more countries to view and compare impact data
          </p>
          
          {selectedCountries.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCountries.map(country => (
                <Badge 
                  key={country}
                  className="px-3 py-1.5 rounded-md bg-[#34502b] text-white"
                >
                  {getFullCountryName(country)}
                </Badge>
              ))}
            </div>
          )}

          <CountryButtonSelect 
            countries={availableCountries}
            selectedCountries={selectedCountries}
            onCountryChange={handleCountryChange}
          />
        </div>
      </Card>
      
      {selectedCountries.length > 0 && (
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
