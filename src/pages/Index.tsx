import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        <div className="flex justify-between items-start">
          <h1 className="text-4xl font-bold" style={{ fontFamily: 'Forma DJR Display' }}>
            Sustainable Brand Index Rankings
          </h1>
          <img 
            src="/lovable-uploads/f129e07e-0768-435f-bbeb-9031a3217f84.png" 
            alt="Sustainable Brand Index Logo" 
            className="h-16 object-contain"
          />
        </div>
        
        <div className="space-y-8">
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
    </div>
  );
};

export default Index;