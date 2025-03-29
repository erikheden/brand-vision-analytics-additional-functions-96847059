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
  return <div className="flex-grow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-[#34502b] flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Cross-Country Brand Comparison
          </h1>
          
        </div>
        
        <div className="space-y-6">
          <CountryComparisonPanel selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands} />
          
          {selectedCountries.length > 0 && selectedBrands.length > 0 ? <CountryComparisonChart selectedCountries={selectedCountries} selectedBrands={selectedBrands} /> : <Card className="p-6 bg-white text-center border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <div className="py-12">
                <Globe className="h-16 w-16 text-[#34502b]/30 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-[#34502b]">Select countries and brands to compare</h3>
                <p className="text-[#34502b]/70 mt-2 max-w-md mx-auto">
                  Choose multiple countries and brands to see how they compare across different markets.
                </p>
              </div>
            </Card>}
        </div>
      </div>
    </div>;
};
export default CountryComparison;