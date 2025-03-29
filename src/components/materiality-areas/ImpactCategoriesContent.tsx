
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import CountrySelect from "@/components/CountrySelect";
import { useSustainabilityImpactData } from "@/hooks/useSustainabilityImpactData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ImpactBarChart from "./ImpactBarChart";

const ImpactCategoriesContent = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  const {
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error
  } = useSustainabilityImpactData(selectedCountry);
  
  // Set default year to most recent when data loads
  React.useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(Math.max(...years));
    }
  }, [years, selectedYear]);
  
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedYear(null);
  };
  
  // Prepare data for chart
  const prepareChartData = (category: string) => {
    if (!selectedYear || !processedData[category] || !processedData[category][selectedYear]) {
      return [];
    }
    
    return impactLevels.map(level => ({
      name: level,
      value: processedData[category][selectedYear][level] * 100, // Convert to percentage
    }));
  };
  
  // Countries available
  const countries = ["NO", "SE", "DK", "FI", "NL"];
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl mb-6">
        <CountrySelect
          selectedCountry={selectedCountry}
          countries={countries}
          onCountryChange={handleCountryChange}
        />
      </Card>
      
      {selectedCountry && (
        <>
          {isLoading ? (
            <Card className="p-6">
              <Skeleton className="h-[400px] w-full" />
            </Card>
          ) : error ? (
            <Card className="p-6">
              <div className="text-center text-red-500">
                Error loading data. Please try again.
              </div>
            </Card>
          ) : years.length > 0 ? (
            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
                <div className="flex flex-wrap gap-2 justify-center">
                  {years.map(year => (
                    <button
                      key={year}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedYear === year
                          ? 'bg-[#34502b] text-white'
                          : 'bg-white border border-[#34502b]/20 hover:bg-[#34502b]/10'
                      }`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </Card>
              
              <Tabs defaultValue={categories[0]} className="w-full">
                <TabsList className="flex flex-wrap mb-4 bg-[#34502b]/10">
                  {categories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {categories.map(category => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <Card className="p-6 bg-white shadow-md rounded-lg">
                      <ImpactBarChart 
                        data={prepareChartData(category)}
                        title={`${category} (${selectedYear})`}
                      />
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          ) : (
            <Card className="p-6">
              <div className="text-center text-gray-500">
                No data available for this country.
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ImpactCategoriesContent;
