
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import CountrySelect from "@/components/CountrySelect";
import { useSustainabilityImpactData } from "@/hooks/useSustainabilityImpactData";
import ImpactBarChart from "./ImpactBarChart";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const ImpactCategoriesContent = () => {
  // State for selected filters
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Get impact data for the selected country
  const { 
    categories,
    years,
    isLoading,
    error,
    processedData
  } = useSustainabilityImpactData(selectedCountry);
  
  // Countries available
  const countries = ["NO", "SE", "DK", "FI", "NL"];
  
  // Handle country selection
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCategories([]);
    setSelectedYear(null);
  };
  
  // Handle category toggle
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  // Prepare data for the selected categories and year
  const chartData = useMemo(() => {
    if (selectedCategories.length === 0 || !selectedYear) {
      return [];
    }
    
    let allData: Array<{name: string; value: number; category: string}> = [];
    
    selectedCategories.forEach(category => {
      if (processedData[category] && processedData[category][selectedYear]) {
        const impactLevels = processedData[category][selectedYear];
        
        Object.entries(impactLevels).forEach(([level, percentage]) => {
          allData.push({
            name: level,
            value: percentage * 100, // Convert to percentage
            category: category
          });
        });
      }
    });
    
    return allData;
  }, [selectedCategories, selectedYear, processedData]);

  return (
    <div className="space-y-6">
      {/* Country Selection Card */}
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <CountrySelect
          selectedCountry={selectedCountry}
          countries={countries}
          onCountryChange={handleCountryChange}
        />
      </Card>
      
      {selectedCountry && (
        <>
          {/* Category and Year Selection */}
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="md:w-1/2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Categories
                </Label>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                        disabled={isLoading}
                      />
                      <Label 
                        htmlFor={`category-${category}`}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="md:w-1/2">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Year
                </Label>
                <div className="flex flex-wrap gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => setSelectedYear(year)}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
                        ${selectedYear === year 
                          ? 'bg-[#34502b] text-white' 
                          : 'bg-white text-[#34502b] border border-[#34502b]/30 hover:bg-[#34502b]/10'
                        }`}
                      disabled={isLoading}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Results Display */}
          <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-lg rounded-xl">
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-500">Loading data...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-80">
                <p className="text-red-500">Error loading data. Please try again.</p>
              </div>
            ) : selectedCategories.length > 0 && selectedYear ? (
              chartData.length > 0 ? (
                <div className="h-[500px]">
                  <ImpactBarChart 
                    data={chartData} 
                    title={`Impact Levels (${selectedYear})`} 
                    categories={selectedCategories}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-80">
                  <p className="text-gray-500">No data available for the selected categories and year.</p>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-500">Please select categories and a year to view the data.</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default ImpactCategoriesContent;
