
import React from "react";
import { Card } from "@/components/ui/card";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useKnowledgePage } from "./KnowledgePageProvider";

const CountryYearSelector: React.FC = () => {
  const {
    selectedCountries,
    handleCountriesChange,
    selectedYear,
    setSelectedYear,
    allYears
  } = useKnowledgePage();

  // Available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Select Countries</h3>
            <CountryMultiSelect
              countries={countries}
              selectedCountries={selectedCountries}
              setSelectedCountries={handleCountriesChange}
            />
          </div>
        </div>
        
        <div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Select Year</h3>
            <YearSelector
              years={allYears}
              selectedYear={selectedYear}
              onChange={setSelectedYear}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CountryYearSelector;
