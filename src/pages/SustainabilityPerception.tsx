
import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const SustainabilityPerception = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
          
        <SelectionPanel 
          selectedCountry={selectedCountry} 
          setSelectedCountry={setSelectedCountry} 
          selectedBrands={selectedBrands} 
          setSelectedBrands={setSelectedBrands} 
        />
          
        <ChartSection 
          selectedCountry={selectedCountry} 
          selectedBrands={selectedBrands} 
        />
      </div>
    </div>
  );
};

export default SustainabilityPerception;
