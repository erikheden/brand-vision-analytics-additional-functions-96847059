import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-[#4A6741]">
        <img 
          src="/lovable-uploads/34ced083-6a8b-48a1-b716-385fd7ab80f5.png" 
          alt="Ranking Database 2011-2024" 
          className="w-full max-w-[1400px] mx-auto h-auto"
        />
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
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