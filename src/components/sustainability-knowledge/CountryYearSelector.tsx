import React from "react";
import { Card } from "@/components/ui/card";
import CountryMultiSelect from "@/components/CountryMultiSelect";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { useKnowledgePage } from "./KnowledgePageProvider";
const CountryYearSelector: React.FC = () => {
  const {
    selectedCountries,
    selectedYear,
    handleCountriesChange,
    setSelectedYear,
    allYears
  } = useKnowledgePage();
  return <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-[#34502b] mb-2">Select Countries</h2>
          <p className="text-gray-600 text-sm mb-4">Select one or more countries to view and compare sustainability knowledge data.</p>
          <CountryMultiSelect countries={["SE", "NO", "DK", "FI", "NL"]} selectedCountries={selectedCountries} setSelectedCountries={handleCountriesChange} />
        </div>
        
        {selectedCountries.length > 0 && allYears.length > 0 && <div>
            <h2 className="text-lg font-semibold text-[#34502b] mb-2">Select Year</h2>
            <p className="text-gray-600 text-sm mb-4">Choose which year's data to display.</p>
            <div className="max-w-xs">
              <YearSelector years={allYears} selectedYear={selectedYear} onChange={setSelectedYear} />
            </div>
          </div>}
      </div>
    </Card>;
};
export default CountryYearSelector;