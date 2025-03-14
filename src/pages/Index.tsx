
import { useState } from "react";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";
const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  return <div className="min-h-screen bg-white flex flex-col">
      <div className="w-full bg-[#34502b] px-0 my-0 mx-0 py-0">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <img src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" alt="Data Dashboard" className="h-12 md:h-16 w-auto animate-fade-in" />
          <img src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" alt="SB Index Logo" className="h-24 md:h-30 w-auto" />
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8 flex-grow">
        <div className="space-y-6">
          <SelectionPanel selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} />
          
          <ChartSection selectedCountry={selectedCountry} selectedBrands={selectedBrands} />
        </div>
      </div>
      
      {/* Footer section */}
      <div className="w-full bg-[#34502b] px-0 my-0 mx-0 py-4">
        <div className="max-w-[1400px] mx-auto px-6">
          <p className="text-xs text-center text-white">
            © 2025 SB Insight AB. All rights reserved.
          </p>
          <p className="text-xs text-center text-white mt-2">
            The data, visualisations, and insights displayed on this platform are the exclusive property of SB Insight AB and are protected by copyright and other intellectual property laws. Access is granted solely for internal review and analysis by authorised users. Exporting, reproducing, distributing, or publishing any content from this platform—whether in whole or in part—without prior written permission from SB Insight AB is strictly prohibited.
          </p>
          <p className="text-xs text-center text-white mt-2">
            Unauthorised use may result in legal action. For inquiries regarding permitted use, please contact info@sb-insight.com.
          </p>
        </div>
      </div>
    </div>;
};
export default Index;
