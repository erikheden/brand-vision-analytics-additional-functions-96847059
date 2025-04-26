
import React from 'react';
import { useImpactCategories } from '@/hooks/useImpactCategories';
import { Card } from '@/components/ui/card';
import ImpactFilters from './ImpactFilters';
import ImpactResultsDisplay from './ImpactResultsDisplay';
import ImpactCountryComparison from './comparison/ImpactCountryComparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImpactTrendsView from './ImpactTrendsView';

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  const {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    selectedCategories,
    toggleCategory,
    selectedYear,
    setSelectedYear,
    selectedLevels,
    toggleImpactLevel,
    activeCountries,
    handleCountryChange,
    countryDataMap
  } = useImpactCategories(selectedCountries);

  const [activeTab, setActiveTab] = React.useState<string>('visualization');

  // Log the countryDataMap to help debugging
  React.useEffect(() => {
    if (countryDataMap && Object.keys(countryDataMap).length > 0) {
      console.log('ImpactContent - countryDataMap countries:', Object.keys(countryDataMap));
      
      // Log the structure of the first country's processedData
      const firstCountry = Object.keys(countryDataMap)[0];
      if (countryDataMap[firstCountry]?.processedData) {
        const categories = Object.keys(countryDataMap[firstCountry].processedData);
        console.log(`ImpactContent - ${firstCountry} has ${categories.length} categories`);
        
        if (categories.length > 0) {
          const years = Object.keys(countryDataMap[firstCountry].processedData[categories[0]] || {});
          console.log(`ImpactContent - ${firstCountry}, ${categories[0]} has years:`, years);
        }
      }
    }
  }, [countryDataMap]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <ImpactFilters
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          years={years}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          impactLevels={impactLevels}
          selectedLevels={selectedLevels}
          toggleImpactLevel={toggleImpactLevel}
          activeCountries={activeCountries}
          selectedCountries={selectedCountries}
          handleCountryChange={handleCountryChange}
          isLoading={isLoading}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="bg-[#34502b]/10 mb-4">
            <TabsTrigger 
              value="visualization" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
            >
              Impact Visualization
            </TabsTrigger>
            <TabsTrigger 
              value="comparison" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
            >
              Country Comparison
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
            >
              Trends
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="mt-0">
            <ImpactResultsDisplay
              processedData={processedData}
              selectedCategories={selectedCategories}
              selectedYear={selectedYear}
              selectedLevels={selectedLevels}
              isLoading={isLoading}
              error={error}
              selectedCountry={activeCountries[0] || ""}
            />
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-0">
            <ImpactCountryComparison 
              processedData={processedData}
              selectedCategories={selectedCategories}
              selectedYear={selectedYear}
              years={years}
              impactLevels={impactLevels}
              activeCountries={activeCountries}
              countryDataMap={countryDataMap}
            />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-0">
            <ImpactTrendsView 
              processedData={processedData}
              selectedCategories={selectedCategories}
              years={years}
              impactLevels={impactLevels}
              comparisonMode={activeCountries.length > 1}
              activeCountries={activeCountries}
              countryDataMap={countryDataMap}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default ImpactContent;
