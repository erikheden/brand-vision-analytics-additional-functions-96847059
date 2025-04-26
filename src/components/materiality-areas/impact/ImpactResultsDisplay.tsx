
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImpactBarChart from "../ImpactBarChart";
import { getFullCountryName } from "@/components/CountrySelect";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { EmptyState } from "./components/EmptyState";
import { ChartControls } from "./components/ChartControls";
import { AnalysisPanel } from "./components/AnalysisPanel";

type ChartDisplayMode = 'bar' | 'stacked';

interface ImpactResultsDisplayProps {
  isLoading: boolean;
  error: any;
  selectedCountry: string;
  selectedCategories: string[];
  selectedYear: number | null;
  chartData?: {
    byLevel: Array<{ name: string, value: number, category: string }>;
    byCategory: Array<{ name: string, value: number, category: string }>;
  };
  // Add the missing properties that are being passed from ImpactContent.tsx
  processedData?: Record<string, Record<string, Record<string, number>>>;
  selectedLevels?: string[];
  country?: string;
  comparisonMode?: boolean;
  activeCountries?: string[];
}

const ImpactResultsDisplay: React.FC<ImpactResultsDisplayProps> = ({
  isLoading,
  error,
  selectedCountry,
  selectedCategories,
  selectedYear,
  chartData,
  // Include the added props in the component function parameters
  processedData,
  selectedLevels,
  country = "",
  comparisonMode = false,
  activeCountries = []
}) => {
  const [chartMode, setChartMode] = useState<ChartDisplayMode>('bar');
  const [activeCountryTab, setActiveCountryTab] = useState<string>(selectedCountry);
  
  const countryToUse = comparisonMode ? activeCountryTab : (country || selectedCountry);
  const countryName = getFullCountryName(countryToUse) || countryToUse;
  const categories = chartData?.byLevel ? [...new Set(chartData.byLevel.map(item => item.category))] : [];

  React.useEffect(() => {
    if (comparisonMode && activeCountries.length > 0) {
      setActiveCountryTab(activeCountries[0]);
    } else {
      setActiveCountryTab(selectedCountry);
    }
  }, [comparisonMode, activeCountries, selectedCountry]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!countryToUse) {
    return <EmptyState message="Please select a country to view sustainability impact data" />;
  }
  if (!chartData || !chartData.byLevel || chartData.byLevel.length === 0) {
    return <EmptyState message={
      selectedCategories.length === 0 
        ? "Please select at least one category to view impact data" 
        : `No impact data available for the selected criteria in ${countryName} ${selectedYear ? `for ${selectedYear}` : ''}`
    } />;
  }

  const handleChartModeChange = (value: string) => {
    if (value) setChartMode(value as ChartDisplayMode);
  };

  const renderSingleCountryView = () => (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-[#34502b]">
          Impact by Level in {countryName} {selectedYear ? `(${selectedYear})` : ''}
        </h2>
        <ChartControls chartMode={chartMode} onChartModeChange={handleChartModeChange} />
      </div>
      
      <ImpactBarChart
        data={chartData.byLevel}
        title={`Sustainability Impact by Level in ${countryName} ${selectedYear ? `(${selectedYear})` : ''}`}
        categories={categories}
        chartType={chartMode}
      />
      
      {selectedCategories.length > 0 && (
        <AnalysisPanel 
          selectedCategories={selectedCategories}
          countryName={countryName}
          chartData={chartData.byLevel}
        />
      )}
    </>
  );

  const renderComparisonView = () => (
    <Tabs value={activeCountryTab} onValueChange={setActiveCountryTab}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-[#34502b]">
          Impact Levels {selectedYear ? `(${selectedYear})` : ''}
        </h2>
        <ChartControls chartMode={chartMode} onChartModeChange={handleChartModeChange} />
      </div>
      
      <TabsList className="mb-4 bg-[#34502b]/10">
        {activeCountries.map(country => (
          <TabsTrigger 
            key={country} 
            value={country} 
            className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          >
            {getFullCountryName(country)}
          </TabsTrigger>
        ))}
      </TabsList>

      {activeCountries.map(country => (
        <TabsContent key={country} value={country} className="pt-4">
          <ImpactBarChart
            data={chartData.byLevel}
            title={`Sustainability Impact by Level in ${getFullCountryName(country)} ${selectedYear ? `(${selectedYear})` : ''}`}
            categories={categories}
            chartType={chartMode}
          />
          
          {selectedCategories.length > 0 && (
            <AnalysisPanel 
              selectedCategories={selectedCategories}
              countryName={getFullCountryName(country)}
              chartData={chartData.byLevel}
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-8">
        {comparisonMode && activeCountries.length > 0 
          ? renderComparisonView()
          : renderSingleCountryView()
        }
      </div>
    </Card>
  );
};

export default ImpactResultsDisplay;
