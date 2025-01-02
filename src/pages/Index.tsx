import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";
import ChatSection from "@/components/ChatSection";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Sustainable Brand Index Rankings</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
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

          <ChatSection
            selectedCountry={selectedCountry}
            selectedBrands={selectedBrands}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;