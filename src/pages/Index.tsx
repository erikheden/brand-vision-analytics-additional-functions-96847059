
import { useState } from "react";
import { Link } from "react-router-dom";
import SelectionPanel from "@/components/SelectionPanel";
import ChartSection from "@/components/ChartSection";
import UserMenu from "@/components/UserMenu";

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const handleLogoClick = () => {
    window.location.reload();
  };
  return <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="w-full bg-[#34502b] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <img src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" alt="Data Dashboard" className="h-10 md:h-12 w-auto animate-fade-in cursor-pointer" onClick={handleLogoClick} />
          <div className="flex items-center gap-4">
            <UserMenu />
            <img src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" alt="SB Index Logo" className="h-14 md:h-16 w-auto cursor-pointer" onClick={handleLogoClick} />
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-semibold text-[#34502b]">Sustainable Brand Index Dashboard</h1>
              <nav className="flex space-x-4">
                <Link 
                  to="/" 
                  className="text-[#34502b] font-medium hover:underline px-4 py-2 rounded bg-green-50"
                >
                  Brand Rankings
                </Link>
                <Link 
                  to="/sustainability-priorities" 
                  className="text-[#34502b] font-medium hover:underline px-4 py-2 rounded hover:bg-green-50"
                >
                  Sustainability Priorities
                </Link>
              </nav>
            </div>
            
            <SelectionPanel selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} />
            
            <ChartSection selectedCountry={selectedCountry} selectedBrands={selectedBrands} />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="w-full bg-[#34502b] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[41px]">
          <p className="text-[8px] text-center text-white">
            © 2025 SB Insight AB. All rights reserved.
          </p>
          <p className="text-[8px] text-white mt-2 text-center">
            The data, visualisations, and insights displayed on this platform are the exclusive property of SB Insight AB and are protected by copyright and other intellectual property laws. Access is granted solely for internal review and analysis by authorised users. Exporting, reproducing, distributing, or publishing any content from this platform—whether in whole or in part—without prior written permission from SB Insight AB is strictly prohibited.
          </p>
          <p className="text-[8px] text-center text-white mt-2">
            Unauthorised use may result in legal action. For inquiries regarding permitted use, please contact info@sb-insight.com.
          </p>
        </div>
      </div>
    </div>;
};
export default Index;
