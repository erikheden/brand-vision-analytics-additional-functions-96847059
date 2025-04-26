
import React from "react";
import { useImpactCategories } from "@/hooks/useImpactCategories";
import ImpactFiltersContainer from "./ImpactFiltersContainer";
import ImpactVisualizations from "./ImpactVisualizations";
import ImpactTrendsView from "./ImpactTrendsView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import ImpactCountryComparison from "./comparison/ImpactCountryComparison";
import ChartErrorBoundary from "./components/ChartErrorBoundary";

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  const [activeView, setActiveView] = React.useState<string>("categoriesView");
  
  const {
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
    setActiveCountries,
    handleCountryChange,
    countryDataMap
  } = useImpactCategories(selectedCountries);

  // Debug logging to track data flow
  React.useEffect(() => {
    console.log("ImpactContent: Selected Countries:", selectedCountries);
    console.log("ImpactContent: Active Countries:", activeCountries);
    console.log("ImpactContent: Selected Year:", selectedYear);
  }, [selectedCountries, activeCountries, selectedYear]);
  
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
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <Tabs value={activeView} onValueChange={setActiveView}>
            <TabsList className="mb-6 bg-[#34502b]/10">
              <TabsTrigger 
                value="categoriesView" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Categories Overview
              </TabsTrigger>
              <TabsTrigger 
                value="trendsView" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Trends
              </TabsTrigger>
              <TabsTrigger 
                value="comparisonView" 
                className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
              >
                Country Comparison
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categoriesView">
              <ChartErrorBoundary>
                <ImpactVisualizations
                  processedData={processedData}
                  selectedCategories={selectedCategories}
                  selectedYear={selectedYear}
                  selectedLevels={selectedLevels}
                  isLoading={isLoading}
                  error={error}
                />
              </ChartErrorBoundary>
            </TabsContent>
            
            <TabsContent value="trendsView">
              <ChartErrorBoundary>
                <ImpactTrendsView
                  processedData={processedData}
                  selectedCategories={selectedCategories}
                  years={years}
                  impactLevels={impactLevels}
                  comparisonMode={activeCountries.length > 1}
                  activeCountries={activeCountries}
                />
              </ChartErrorBoundary>
            </TabsContent>
            
            <TabsContent value="comparisonView">
              <ChartErrorBoundary>
                <ImpactCountryComparison
                  processedData={processedData}
                  selectedCategories={selectedCategories}
                  selectedYear={selectedYear}
                  years={years}
                  impactLevels={impactLevels}
                  activeCountries={activeCountries}
                  countryDataMap={countryDataMap}
                />
              </ChartErrorBoundary>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ImpactContent;
