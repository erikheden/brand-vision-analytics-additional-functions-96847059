
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountryComparisonPanel from "@/components/CountryComparisonPanel";
import CountryComparisonChart from "@/components/CountryComparisonChart";

const CountryComparison = () => {
  const navigate = useNavigate();
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header - Reusing the same header style */}
      <div className="w-full bg-[#34502b] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <img 
            src="/lovable-uploads/8b26bfaf-912f-4219-9ea9-5bb7156bb1e9.png" 
            alt="Data Dashboard" 
            className="h-10 md:h-12 w-auto animate-fade-in cursor-pointer" 
            onClick={() => navigate('/')}
          />
          <img 
            src="/lovable-uploads/8732b50b-f85b-48ca-91ac-748d8819f66c.png" 
            alt="SB Index Logo" 
            className="h-14 md:h-16 w-auto cursor-pointer" 
            onClick={() => navigate('/')}
          />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#34502b] flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Cross-Country Brand Comparison
            </h1>
            <Button 
              variant="outline" 
              className="border-[#34502b] text-[#34502b] hover:bg-[#34502b]/10"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </div>
          
          <div className="space-y-6">
            <CountryComparisonPanel 
              selectedCountries={selectedCountries} 
              setSelectedCountries={setSelectedCountries}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
            
            {selectedCountries.length > 0 && selectedBrands.length > 0 ? (
              <CountryComparisonChart 
                selectedCountries={selectedCountries} 
                selectedBrands={selectedBrands} 
              />
            ) : (
              <Card className="p-6 bg-white text-center border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="py-12">
                  <Globe className="h-16 w-16 text-[#34502b]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-[#34502b]">Select countries and brands to compare</h3>
                  <p className="text-[#34502b]/70 mt-2 max-w-md mx-auto">
                    Choose multiple countries and brands to see how they compare across different markets.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer - Reusing the same footer */}
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
    </div>
  );
};

export default CountryComparison;
