
import React from "react";
import { useImpactCategories } from "@/hooks/useImpactCategories";
import { useImpactChartData } from "@/hooks/useImpactChartData";
import ImpactFiltersContainer from "./ImpactFiltersContainer";
import ImpactResultsDisplay from "./ImpactResultsDisplay";
import ImpactTrendsView from "./ImpactTrendsView";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, TrendingUp } from "lucide-react";

interface ImpactContentProps {
  selectedCountries: string[];
}

const ImpactContent: React.FC<ImpactContentProps> = ({ selectedCountries }) => {
  const [activeTab, setActiveTab] = React.useState<string>("levels");
  
  const {
    activeCountry,
    selectedCategories,
    selectedYear,
    selectedLevels,
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    handleCountryChange,
    toggleCategory,
    setSelectedYear,
    toggleImpactLevel
  } = useImpactCategories(selectedCountries);

  const chartData = useImpactChartData(
    processedData,
    selectedYear,
    selectedCategories,
    selectedLevels,
    categories,
    impactLevels
  );

  return (
    <div className="space-y-6">
      <ImpactFiltersContainer
        activeCountry={activeCountry}
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
      />

      {activeCountry && (
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
          </TabsList>

          <TabsContent value="levels" className="mt-0">
            <ImpactResultsDisplay
              isLoading={isLoading}
              error={error}
              selectedCountry={activeCountry}
              selectedCategories={selectedCategories}
              selectedYear={selectedYear}
              chartData={chartData}
              data={data}
              processedData={processedData}
              selectedLevels={selectedLevels}
              country={activeCountry}
            />
          </TabsContent>

          <TabsContent value="trends" className="mt-0">
            <ImpactTrendsView
              processedData={processedData}
              selectedCategory={selectedCategories[0]}
              years={years}
              impactLevels={impactLevels}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ImpactContent;
