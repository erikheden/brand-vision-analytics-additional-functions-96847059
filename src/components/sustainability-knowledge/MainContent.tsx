
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSustainabilityKnowledge } from "@/hooks/useSustainabilityKnowledge";
import CountrySelect from "@/components/CountrySelect";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import KnowledgeChart from "./KnowledgeChart";
import KnowledgeTrendChart from "./KnowledgeTrendChart";
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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Select Country</h3>
                  <CountrySelect
                    countries={["SE", "NO", "DK", "FI", "NL"]}
                    selectedCountry={selectedCountry}
                    onCountryChange={handleCountryChange}
                    className="w-full"
                  />
                </div>
                
                {activeTab === "single" ? (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Select Year</h3>
                    <select
                      value={selectedYear}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:ring-[#34502b] focus:border-[#34502b]"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Select Terms</h3>
                      <div className="space-x-2">
                        <button
                          className="text-xs text-[#34502b] hover:text-[#34502b]/80 underline"
                          onClick={handleSelectAllTerms}
                        >
                          {selectedTerms.length === terms.length ? "Clear All" : "Select All"}
                        </button>
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
                      {terms.map((term) => (
                        <div
                          key={term}
                          className={`p-2 rounded-md cursor-pointer transition-colors hover:bg-[#34502b]/5 ${
                            selectedTerms.includes(term) ? 'bg-[#34502b]/10' : ''
                          }`}
                          onClick={() => handleTermToggle(term)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-4 h-4 rounded-sm ${selectedTerms.includes(term) ? 'bg-[#34502b]' : 'border border-gray-300'}`}>
                              {selectedTerms.includes(term) && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="w-4 h-4 text-white"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-800">{term}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <TabsContent value="single" className="mt-0">
              <KnowledgeChart
                data={data}
                selectedYear={selectedYear}
                country={selectedCountry}
                selectedTerms={selectedTerms}
              />
            </TabsContent>

            <TabsContent value="trends" className="mt-0">
              {selectedTerms.length === 0 ? (
                <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
                  <div className="text-center py-10 text-gray-500">
                    Please select at least one term to view trends over time.
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
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MainContent;
