
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KnowledgeLevelsTab from "./KnowledgeLevelsTab";
import KnowledgeTrendsTab from "./KnowledgeTrendsTab";
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
      </TabsList>

      <TabsContent value="levels" className="mt-0">
        <KnowledgeLevelsTab 
          data={countriesData}
          years={allYears}
          selectedYear={selectedYear}
          selectedTerms={selectedTerms}
          selectedCountries={selectedCountries}
          setSelectedYear={setSelectedYear}
        />
      </TabsContent>

      <TabsContent value="trends" className="mt-0">
        <KnowledgeTrendsTab 
          data={countriesData}
          terms={allTerms}
          selectedTerms={selectedTerms}
          selectedCountries={selectedCountries}
          setSelectedTerms={handleSetSelectedTerms}
        />
      </TabsContent>
    </Tabs>
  );
};

export default KnowledgeTabs;
