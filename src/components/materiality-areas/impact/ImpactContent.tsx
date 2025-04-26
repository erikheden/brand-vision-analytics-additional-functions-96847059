
import React, { useEffect } from "react";
import { useImpactCategories } from "@/hooks/useImpactCategories";
import { useImpactChartData } from "@/hooks/useImpactChartData";
import ImpactFiltersContainer from "./ImpactFiltersContainer";
import ImpactResultsDisplay from "./ImpactResultsDisplay";
import ImpactTrendsView from "./ImpactTrendsView";
import ImpactCountryComparison from "./comparison/ImpactCountryComparison";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Users } from "lucide-react";

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  const [activeTab, setActiveTab] = React.useState<string>("levels");
  
  const {
    activeCountries,
    selectedCategories,
    selectedYear,
    selectedLevels,
    data,
    processedData,
    countryDataMap,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel,
    setActiveCountries,
  } = useImpactCategories(selectedCountries);

  // Determine if we're in comparison mode based on number of active countries
  const comparisonMode = activeCountries.length > 1;

  const chartData = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    categories,
    impactLevels
  );

  // Debug logs to verify data
  useEffect(() => {
    if (comparisonMode && selectedYear && countryDataMap) {
      console.log("Country Data Map Keys:", Object.keys(countryDataMap));
      console.log("Selected Year:", selectedYear);
      
      activeCountries.forEach(country => {
        if (countryDataMap[country]) {
          console.log(`Data for ${country}:`, 
            countryDataMap[country].processedData ? 
            "ProcessedData exists" : "No ProcessedData");
        } else {
          console.log(`No data found for ${country}`);
        }
      });
    }
  }, [comparisonMode, countryDataMap, activeCountries, selectedYear]);

  return (
    <div className="space-y-6">
      <ImpactFiltersContainer
        activeCountries={activeCountries}
        selectedCountries={selectedCountries}
        handleCountryChange={handleCountryChange}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        years={years}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        impactLevels={impactLevels}
        selectedLevels={selectedLevels}
        toggleImpactLevel={toggleImpactLevel}
        isLoading={isLoading}
        setActiveCountries={setActiveCountries}
      />

      {activeCountries.length > 0 && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#34502b]/10 mx-auto mb-6">
            <TabsTrigger value="levels" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />
              Impact Levels
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trends
            </TabsTrigger>
            {comparisonMode && (
              <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                Country Comparison
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="levels" className="mt-0">
            <ImpactResultsDisplay
              isLoading={isLoading}
              error={error}
              selectedCountry={activeCountries[0]}
              selectedCategories={selectedCategories}
              selectedYear={selectedYear}
              chartData={chartData}
              processedData={processedData}
              selectedLevels={selectedLevels}
              country={activeCountries[0]}
              comparisonMode={comparisonMode}
              activeCountries={activeCountries}
            />
          </TabsContent>

          <TabsContent value="trends" className="mt-0">
            <ImpactTrendsView
              processedData={processedData}
              selectedCategories={selectedCategories}
              years={years}
              impactLevels={impactLevels}
              comparisonMode={comparisonMode}
              activeCountries={activeCountries}
            />
          </TabsContent>

          {comparisonMode && (
            <TabsContent value="comparison" className="mt-0">
              <ImpactCountryComparison
                processedData={processedData}
                selectedCategories={selectedCategories}
                selectedYear={selectedYear}
                years={years}
                impactLevels={impactLevels}
                activeCountries={activeCountries}
                countryDataMap={countryDataMap} // Pass the country-specific data map
              />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default ImpactContent;
