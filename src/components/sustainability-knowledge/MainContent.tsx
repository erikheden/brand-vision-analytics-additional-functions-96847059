
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSustainabilityKnowledge } from "@/hooks/useSustainabilityKnowledge";
import CountrySelect from "@/components/CountrySelect";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import KnowledgeChart from "./KnowledgeChart";
import KnowledgeTrendChart from "./KnowledgeTrendChart";
import SidebarControls from "./SidebarControls";
import { useToast } from "@/components/ui/use-toast";

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("SE");
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("single");

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

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const handleTermToggle = (term: string) => {
    if (selectedTerms.includes(term)) {
      setSelectedTerms(selectedTerms.filter(t => t !== term));
    } else {
      if (selectedTerms.length >= 5 && activeTab === "trends") {
        toast({
          title: "Selection Limit",
          description: "You can select up to 5 terms for trend comparison",
          variant: "destructive",
        });
        return;
      }
      setSelectedTerms([...selectedTerms, term]);
    }
  };

  const handleSelectAllTerms = () => {
    if (activeTab === "trends" && terms.length > 5) {
      toast({
        title: "Selection Limit",
        description: "You can select up to 5 terms for trend comparison. Please select terms individually.",
        variant: "destructive",
      });
      return;
    }
    setSelectedTerms([...terms]);
  };

  const handleClearTerms = () => {
    setSelectedTerms([]);
  };

  if (error) return <ErrorState />;

  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full md:w-1/4">
        <SidebarControls
          countries={["SE", "NO", "DK", "FI", "NL"]}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          terms={terms}
          selectedTerms={selectedTerms}
          onTermToggle={handleTermToggle}
          onSelectAll={handleSelectAllTerms}
          onClearAll={handleClearTerms}
          isLoading={isLoading}
        />
      </div>

      <div className="w-full md:w-3/4">
        <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
        
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
            {isLoading ? (
              <LoadingState />
            ) : (
              <div className="space-y-6">
                <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-lg font-medium text-[#34502b]">
                      Knowledge Levels by Term
                    </div>
                    <div className="flex items-center space-x-2">
                      <label className="text-sm font-medium text-gray-700">Year:</label>
                      <select
                        value={selectedYear}
                        onChange={(e) => handleYearChange(Number(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#34502b] focus:border-[#34502b]"
                      >
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </Card>

                <KnowledgeChart
                  data={data}
                  selectedYear={selectedYear}
                  country={selectedCountry}
                  selectedTerms={selectedTerms}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="mt-0">
            {isLoading ? (
              <LoadingState />
            ) : selectedTerms.length === 0 ? (
              <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                <div className="text-center py-10 text-gray-500">
                  Please select at least one term from the sidebar to view trends over time.
                </div>
              </Card>
            ) : (
              <KnowledgeTrendChart
                data={data}
                selectedTerms={selectedTerms}
                country={selectedCountry}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MainContent;
