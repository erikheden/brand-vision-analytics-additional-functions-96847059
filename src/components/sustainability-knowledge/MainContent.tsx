
import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSustainabilityKnowledge } from "@/hooks/useSustainabilityKnowledge";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { useToast } from "@/components/ui/use-toast";

// Import our new component files
import SidebarPanel from "./SidebarPanel";
import KnowledgeLevelsTab from "./KnowledgeLevelsTab";
import KnowledgeTrendsTab from "./KnowledgeTrendsTab";

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("SE");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("single");

  // Available countries
  const countries = ["SE", "NO", "DK", "FI", "NL"];
  
  // Get knowledge data
  const { data, years, terms, isLoading, error } = useSustainabilityKnowledge(selectedCountry);

  // Set initial year when years are loaded
  useEffect(() => {
    if (years.length > 0) {
      setSelectedYear(Math.max(...years));
    }
  }, [years]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedTerms([]);
    toast({
      title: "Country Changed",
      description: `Showing data for ${country}`,
      duration: 3000,
    });
  };

  const handleSetSelectedTerms = (terms: string[]) => {
    if (activeTab === "trends" && terms.length > 5) {
      toast({
        title: "Selection Limit",
        description: "You can select up to 5 terms for trend comparison",
        variant: "destructive",
      });
      return;
    }
    setSelectedTerms(terms);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
      
      <div className="mb-6">
        <SidebarPanel 
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          countries={countries}
          isLoading={isLoading}
        />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0 mb-6">
          <TabsTrigger value="single" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
            Knowledge Levels
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
            Knowledge Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="mt-0">
          <KnowledgeLevelsTab 
            data={data}
            years={years}
            selectedYear={selectedYear}
            selectedTerms={selectedTerms}
            selectedCountry={selectedCountry}
            setSelectedYear={setSelectedYear}
          />
        </TabsContent>

        <TabsContent value="trends" className="mt-0">
          <KnowledgeTrendsTab 
            data={data}
            terms={terms}
            selectedTerms={selectedTerms}
            selectedCountry={selectedCountry}
            setSelectedTerms={handleSetSelectedTerms}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MainContent;
