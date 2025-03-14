import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";
const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  return <div className="min-h-screen bg-white">
      <div className="w-full bg-[#34502b] px-0 my-0 mx-0 py-0">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <img src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" alt="Data Dashboard" className="h-12 md:h-16 w-auto animate-fade-in" />
          <img src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" alt="SB Index Logo" className="h-24 md:h-30 w-auto" />
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        <div className="space-y-6">
          <SelectionPanel selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} />
          
          <ChartSection selectedCountry={selectedCountry} selectedBrands={selectedBrands} />
        </div>
      </div>
    </div>;
};
export default Index;