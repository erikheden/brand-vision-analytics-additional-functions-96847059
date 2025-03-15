import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Check, Info, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMultiCountryChartData } from "@/hooks/useMultiCountryChartData";
import { getFullCountryName } from "@/components/CountrySelect";
import CountryBarChart from "./CountryBarChart";
import CountryLineChart from "./CountryLineChart";
import EmptyChartState from "./EmptyChartState";

interface CountryComparisonChartProps {
  selectedCountries: string[];
  selectedBrands: string[];
}

const CountryComparisonChart = ({
  selectedCountries,
  selectedBrands
}: CountryComparisonChartProps) => {
  const [standardized, setStandardized] = useState(false);
  const [chartType, setChartType] = useState("line");
  
  const { data: allCountriesData, isLoading } = useMultiCountryChartData(selectedCountries, selectedBrands);
  
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-pulse text-[#34502b]">Loading data...</div>
        </div>
      </Card>
    );
  }
  
  if (!allCountriesData || Object.keys(allCountriesData).length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <EmptyChartState selectedCountry={selectedCountries[0] || ""} />
      </Card>
    );
  }
  
  const totalDataPoints = Object.values(allCountriesData).reduce(
    (total, countryData) => total + (countryData?.length || 0), 
    0
  );
  
  if (totalDataPoints === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-[#34502b]">No data available</h3>
          <p className="text-[#34502b]/70 mt-2">
            There is no data available for the selected brands in these countries.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6 mb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs defaultValue="line" value={chartType} onValueChange={setChartType} className="w-full md:w-auto">
          <TabsList className="bg-[#34502b]/10">
            <TabsTrigger value="line" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Line Chart
            </TabsTrigger>
            <TabsTrigger value="bar" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              Bar Chart
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#34502b] font-medium">Standardized Scores</span>
            <div className="relative flex items-center">
              <Toggle 
                pressed={standardized} 
                onPressedChange={setStandardized} 
                aria-label="Toggle standardized scores" 
                className="border border-[#34502b]/30 relative bg-[#f0d2b0] font-semibold transition-all duration-300 hover:bg-[#e5c7a5]"
              >
                {standardized && <Check className="h-4 w-4 text-[#34502b] absolute animate-scale-in" />}
              </Toggle>
              <span className="ml-2">
                <Sparkles className="h-4 w-4 text-[#34502b] opacity-70 animate-pulse" />
              </span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-[#34502b] transition-transform hover:scale-110" />
                </TooltipTrigger>
                <TooltipContent className="bg-white p-3 max-w-xs shadow-lg">
                  <p>Standardized scores normalize the data against the entire market average in each country, showing how many standard deviations each brand is above or below the market mean.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
        {chartType === "line" ? (
          <CountryLineChart 
            allCountriesData={allCountriesData} 
            selectedBrands={selectedBrands}
            standardized={standardized}
          />
        ) : (
          <CountryBarChart 
            allCountriesData={allCountriesData}
            selectedBrands={selectedBrands}
            standardized={standardized}
          />
        )}
      </Card>
    </div>
  );
};

export default CountryComparisonChart;
