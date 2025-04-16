
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KnowledgeLevelsTab from "./KnowledgeLevelsTab";
import KnowledgeTrendsTab from "./KnowledgeTrendsTab";
import CountryComparisonTab from "./CountryComparisonTab";
import { useKnowledgePage } from "./KnowledgePageProvider";

const KnowledgeTabs: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedCountries,
    countriesData,
    selectedYear,
    allYears,
    allTerms,
    selectedTerms,
    handleSetSelectedTerms,
    setSelectedYear
  } = useKnowledgePage();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
        <TabsTrigger value="levels" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
          Knowledge Levels
        </TabsTrigger>
        <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
          Knowledge Trends
        </TabsTrigger>
        <TabsTrigger value="comparison" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
          Country Comparison
        </TabsTrigger>
      </TabsList>

      <TabsContent value="levels" className="mt-0">
        {selectedCountries.length === 1 ? (
          <KnowledgeLevelsTab 
            data={countriesData[selectedCountries[0]] || []}
            years={allYears}
            selectedYear={selectedYear}
            selectedTerms={selectedTerms}
            selectedCountry={selectedCountries[0]}
            setSelectedYear={setSelectedYear}
          />
        ) : (
          <div className="text-center py-6 text-gray-500">
            Please select only one country for Knowledge Levels view
          </div>
        )}
      </TabsContent>

      <TabsContent value="trends" className="mt-0">
        {selectedCountries.length === 1 ? (
          <KnowledgeTrendsTab 
            data={countriesData[selectedCountries[0]] || []}
            terms={allTerms}
            selectedTerms={selectedTerms}
            selectedCountry={selectedCountries[0]}
            setSelectedTerms={handleSetSelectedTerms}
          />
        ) : (
          <div className="text-center py-6 text-gray-500">
            Please select only one country for Knowledge Trends view
          </div>
        )}
      </TabsContent>

      <TabsContent value="comparison" className="mt-0">
        <CountryComparisonTab
          selectedCountries={selectedCountries}
          terms={allTerms}
          countriesData={countriesData}
          selectedYear={selectedYear}
        />
      </TabsContent>
    </Tabs>
  );
};

export default KnowledgeTabs;
