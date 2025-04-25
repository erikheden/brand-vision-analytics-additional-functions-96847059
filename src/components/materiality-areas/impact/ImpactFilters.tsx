
import React from "react";
import { Card } from "@/components/ui/card";
import CountryButtonSelect from "@/components/CountryButtonSelect";
import ImpactCategoryFilter from "./ImpactCategoryFilter";
import ImpactYearFilter from "./ImpactYearFilter";
import ImpactLevelFilter from "./ImpactLevelFilter";
import { Toggle } from "@/components/ui/toggle";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getFullCountryName } from "@/components/CountrySelect";

interface ImpactFiltersProps {
  selectedCountry: string;
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
  comparisonMode: boolean;
  toggleComparisonMode: (enabled: boolean) => void;
  setSelectedCountries: (countries: string[]) => void;
}

const ImpactFilters: React.FC<ImpactFiltersProps> = ({
  selectedCountry,
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
  isLoading,
  comparisonMode,
  toggleComparisonMode,
  setSelectedCountries
}) => {
  return (
    <>
      {/* Country Selection Card */}
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold text-[#34502b]">
            {comparisonMode ? "Selected Countries" : "Active Country"}
          </h2>

          {/* Comparison Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#34502b] hidden md:inline">Country Comparison</span>
            <Toggle 
              pressed={comparisonMode} 
              onPressedChange={toggleComparisonMode}
              aria-label="Toggle country comparison mode"
              className="bg-[#34502b]/10 data-[state=on]:bg-[#34502b] data-[state=on]:text-white"
            >
              <Users className="h-4 w-4 mr-1" /> 
              <span className="text-xs">Compare</span>
            </Toggle>
          </div>
        </div>

        {comparisonMode ? (
          // In comparison mode, show the selected countries as badges
          <div className="mb-4">
            <p className="text-gray-600 text-sm mb-4">
              Select countries to compare their impact data
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCountries.map(country => (
                <Badge 
                  key={country}
                  className={`px-3 py-1.5 rounded-md ${
                    availableCountries.includes(country) ? "bg-[#34502b] text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {getFullCountryName(country)}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          // In single country mode, show the description for active country
          <p className="text-gray-600 text-sm mb-4">
            Select which country to view detailed impact data for
          </p>
        )}

        {/* Country Selection */}
        <CountryButtonSelect 
          selectedCountry={comparisonMode ? undefined : selectedCountry}
          selectedCountries={comparisonMode ? selectedCountries : undefined}
          countries={availableCountries} 
          onCountryChange={handleCountryChange}
        />
      </Card>
      
      {(selectedCountry || (comparisonMode && selectedCountries.length > 0)) && (
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
