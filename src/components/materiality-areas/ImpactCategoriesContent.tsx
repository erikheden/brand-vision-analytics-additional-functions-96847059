
import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import CountrySelect from "@/components/CountrySelect";
import { useSustainabilityImpactData } from "@/hooks/useSustainabilityImpactData";
import ImpactBarChart from "./ImpactBarChart";

const ImpactCategoriesContent = () => {
  // State for selected filters
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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
    setSelectedCategory("");
    setSelectedYear(null);
  };
  
  // Prepare data for the selected category and year
  const chartData = useMemo(() => {
    if (!selectedCategory || !selectedYear || !processedData[selectedCategory] || !processedData[selectedCategory][selectedYear]) {
      return [];
    }
    
    const impactLevels = processedData[selectedCategory][selectedYear];
    return Object.entries(impactLevels).map(([level, percentage]) => ({
      name: level,
      value: percentage * 100 // Convert to percentage
    }));
  }, [selectedCategory, selectedYear, processedData]);

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
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-1/2">
                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#34502b]"
                  disabled={isLoading}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="md:w-1/2">
                <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Year
                </label>
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
            ) : selectedCategory && selectedYear ? (
              chartData.length > 0 ? (
                <div className="h-[500px]">
                  <ImpactBarChart 
                    data={chartData} 
                    title={`${selectedCategory} - Impact Levels (${selectedYear})`} 
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center h-80">
                  <p className="text-gray-500">No data available for the selected category and year.</p>
                </div>
              )
            ) : (
              <div className="flex justify-center items-center h-80">
                <p className="text-gray-500">Please select a category and year to view the data.</p>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

export default ImpactCategoriesContent;
