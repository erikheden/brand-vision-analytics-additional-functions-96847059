
import { useState } from "react";
import SelectionPanel from "@/components/sustainability-shared/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const SustainabilityPerception = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
          
        <SelectionPanel 
          title="Select Countries"
          description="Select one or more countries to view sustainability perception."
          selectedCountries={selectedCountries}
          setSelectedCountries={setSelectedCountries}
        />
          
        {selectedCountries.length > 0 && (
          <ChartSection 
            selectedCountry={selectedCountries[0]} 
            selectedBrands={selectedBrands} 
          />
        )}
      </div>
    </div>
  );
};

export default SustainabilityPerception;
