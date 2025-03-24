
import { useState } from "react";
import { useTitle } from "@/hooks/use-page-title";
import CountryComparisonPanel from "@/components/CountryComparisonPanel";
import CountryComparisonChart from "@/components/CountryComparisonChart";

const CountryComparisonPage = () => {
  useTitle("Country Comparison");
  
  // State for selected countries and brands
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Cross-Country Brand Comparison</h1>
        <p className="text-[#34502b]/80 mt-1">
          Compare how the same brands perform across different countries over time
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CountryComparisonPanel 
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
        />

        {selectedCountries.length > 0 && selectedBrands.length > 0 && (
          <CountryComparisonChart 
            selectedCountries={selectedCountries}
            selectedBrands={selectedBrands}
          />
        )}
      </div>
    </div>
  );
};

export default CountryComparisonPage;
