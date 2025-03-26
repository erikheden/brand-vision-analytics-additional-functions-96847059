
import { useState, useMemo, useEffect } from "react";
import { useGeneralMaterialityData } from "@/hooks/useGeneralMaterialityData";
import CountrySelect from "@/components/CountrySelect";
import PrioritiesBarChart from "@/components/sustainability-priorities/PrioritiesBarChart";
import PrioritiesTrendChart from "@/components/sustainability-priorities/PrioritiesTrendChart";
import AreaSelector from "@/components/sustainability-priorities/AreaSelector";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import UserMenu from "@/components/UserMenu";
import { useToast } from "@/components/ui/use-toast";

const SustainabilityPriorities = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  
  const { data: materialityData = [], isLoading, error } = useGeneralMaterialityData(selectedCountry);
  
  useEffect(() => {
    // Log data to help with debugging
    console.log("Materiality data loaded:", materialityData.length > 0 ? "Yes" : "No");
    if (materialityData.length > 0) {
      console.log("Sample data:", materialityData.slice(0, 2));
    }
    
    // Reset selected areas when country changes
    setSelectedAreas([]);
  }, [materialityData]);
  
  // Extract unique years from the data
  const years = useMemo(() => {
    if (!materialityData.length) return [2023, 2024]; // Default years if no data
    return [...new Set(materialityData.map(item => item.year))].sort((a, b) => a - b);
  }, [materialityData]);
  
  // Set default to most recent year
  const [selectedYear, setSelectedYear] = useState<number>(
    years.length > 0 ? Math.max(...years) : 2024
  );
  
  // Update selected year when years change
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);
  
  // Extract unique areas from the data
  const areas = useMemo(() => {
    if (!materialityData.length) return [];
    return [...new Set(materialityData.map(item => item.materiality_area))];
  }, [materialityData]);
  
  // Get available countries (we can reuse the CountrySelect component)
  const countries = ["Se", "No", "Dk", "Fi", "Nl"];
  
  // Handle logo click to reload the page
  const handleLogoClick = () => {
    window.location.reload();
  };
  
  // Handle country selection with toast notification
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    toast({
      title: "Country Selected",
      description: `Showing sustainability priorities for ${country}`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
              <h1 className="text-2xl font-semibold text-[#34502b]">General Sustainability Priorities</h1>
            </div>
            
            {/* Country Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <CountrySelect 
                  selectedCountry={selectedCountry} 
                  countries={countries} 
                  onCountryChange={handleCountryChange} 
                />
              </div>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Failed to load sustainability priorities data: {error instanceof Error ? error.message : 'Unknown error'}
                </AlertDescription>
              </Alert>
            )}
            
            {isLoading && (
              <div className="text-center py-10">Loading data...</div>
            )}
            
            {!selectedCountry && !isLoading && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">Please select a country to view sustainability priorities.</p>
              </div>
            )}
            
            {selectedCountry && materialityData.length > 0 && !isLoading && (
              <div className="space-y-8">
                {/* Bar Chart Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <YearSelector 
                        years={years} 
                        selectedYear={selectedYear} 
                        onChange={setSelectedYear} 
                      />
                    </div>
                  </div>
                  
                  <PrioritiesBarChart 
                    data={materialityData}
                    selectedYear={selectedYear}
                  />
                </div>
                
                {/* Line Chart Section */}
                <div className="space-y-4">
                  <AreaSelector 
                    areas={areas}
                    selectedAreas={selectedAreas}
                    onChange={setSelectedAreas}
                  />
                  
                  <PrioritiesTrendChart 
                    data={materialityData}
                    selectedAreas={selectedAreas}
                  />
                </div>
              </div>
            )}
            
            {selectedCountry && materialityData.length === 0 && !isLoading && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">No sustainability priorities data found for {selectedCountry}. Sample data will be shown instead.</p>
              </div>
            )}
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
    </div>
  );
};

export default SustainabilityPriorities;
