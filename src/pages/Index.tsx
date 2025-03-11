
import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b7c895] to-[#34502b]">
      <div className="w-full bg-transparent py-6">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl text-white font-bely font-normal animate-fade-in">
            Data Dashboard
          </h1>
          <img 
            src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
            alt="SB Index Logo" 
            className="h-24 md:h-30 w-auto"
          />
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        <div className="space-y-6">
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
