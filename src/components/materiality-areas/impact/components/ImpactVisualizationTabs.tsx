
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ImpactCategoryChart from '../charts/ImpactCategoryChart';
import ImpactCountryComparison from '../comparison/ImpactCountryComparison';
import ImpactTrendsView from '../ImpactTrendsView';

interface ImpactVisualizationTabsProps {
  filteredData: Record<string, Record<string, Record<string, number>>>;
  processedData: Record<string, Record<string, Record<string, number>>>;
  selectedCategories: string[];
  selectedYear: number | null;
  selectedLevels: string[];
  years: number[];
  impactLevels: string[];
  activeCountries: string[];
  countryDataMap?: Record<string, any>;
}

const ImpactVisualizationTabs: React.FC<ImpactVisualizationTabsProps> = ({
  filteredData,
  processedData,
  selectedCategories,
  selectedYear,
  selectedLevels,
  years,
  impactLevels,
  activeCountries,
  countryDataMap
}) => {
  const [activeTab, setActiveTab] = useState<string>("category");
  
  const isComparisonDisabled = activeCountries.length <= 1 || selectedCategories.length === 0 || !selectedYear;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6 bg-[#34502b]/10">
        <TabsTrigger 
          value="category" 
          className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
        >
          Category View
        </TabsTrigger>
        <TabsTrigger 
          value="trends" 
          className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
        >
          Trends
        </TabsTrigger>
        <TabsTrigger 
          value="comparison" 
          className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          disabled={isComparisonDisabled}
        >
          Country Comparison
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="category" className="mt-0">
        <ImpactCategoryChart 
          data={filteredData}
          selectedYear={selectedYear}
          selectedLevels={selectedLevels}
        />
      </TabsContent>
      
      <TabsContent value="trends" className="mt-0">
        {selectedCategories.length > 0 ? (
          <ImpactTrendsView 
            processedData={processedData}
            selectedCategories={selectedCategories}
            years={years}
            impactLevels={impactLevels}
            comparisonMode={false}
            activeCountries={activeCountries}
            countryDataMap={countryDataMap}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Please select at least one category to view trend data.
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="comparison" className="mt-0">
        {!isComparisonDisabled ? (
          <ImpactCountryComparison 
            processedData={processedData}
            selectedCategories={selectedCategories}
            selectedYear={selectedYear}
            years={years}
            impactLevels={impactLevels}
            activeCountries={activeCountries}
            countryDataMap={countryDataMap}
          />
        ) : (
          <div className="text-center py-10 text-gray-500">
            Please select at least two countries and one category to compare data.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ImpactVisualizationTabs;
