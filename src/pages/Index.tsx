import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full bg-[#8B9F75] py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl text-white font-['bely-display'] font-normal">
            Ranking Database 2011-2024
          </h1>
          <img 
            src="/lovable-uploads/34ced083-6a8b-48a1-b716-385fd7ab80f5.png" 
            alt="SB Index Logo" 
            className="h-16 md:h-20 w-auto"
          />
        </div>
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