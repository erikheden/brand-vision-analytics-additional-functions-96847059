
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useSustainabilityKnowledge } from '@/hooks/useSustainabilityKnowledge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import SidebarControls from './SidebarControls';
import KnowledgeChart from './KnowledgeChart';
import KnowledgeTrendChart from './KnowledgeTrendChart';

const MainContent = () => {
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState<string>("SE"); // Default to Sweden
  const [activeTab, setActiveTab] = useState<string>("yearly");
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  
  console.log("Knowledge MainContent rendered with selectedCountry:", selectedCountry);
  
  const { 
    data: knowledgeData = [], 
    years = [],
    terms = [],
    isLoading, 
    error 
  } = useSustainabilityKnowledge(selectedCountry);
  
  console.log("Knowledge MainContent received data:", {
    dataCount: knowledgeData.length,
    yearsCount: years.length,
    termsCount: terms.length,
    isLoading,
    hasError: !!error
  });
  
  // Set default selected year to the most recent one, but only if it exists in the data
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Update selected year when years data changes
  useEffect(() => {
    if (years.length > 0) {
      const maxYear = Math.max(...years);
      console.log(`Setting selectedYear to max year: ${maxYear}`);
      setSelectedYear(maxYear);
    }
  }, [years]);
  
  // Initialize selected terms when terms data changes
  useEffect(() => {
    if (terms.length > 0 && selectedTerms.length === 0) {
      // Select all terms by default
      console.log("Initial terms selection:", terms);
      setSelectedTerms(terms);
    }
  }, [terms, selectedTerms.length]);
  
  const handleCountryChange = (country: string) => {
    console.log("Country selected:", country);
    setSelectedCountry(country);
    // Reset selected terms when country changes
    setSelectedTerms([]);
    toast({
      title: "Country Selected",
      description: `Showing sustainability knowledge for ${country}`,
      duration: 3000,
    });
  };

  const countries = ["SE", "NO", "DK", "FI", "NL"];

  if (isLoading) {
    console.log("Rendering loading state");
    return <LoadingState />;
  }

  if (error) {
    console.log("Rendering error state:", error);
    return <ErrorState />;
  }

  console.log("Rendering main content with selected year:", selectedYear);
  console.log("Active tab:", activeTab);
  console.log("Currently selected terms:", selectedTerms);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Knowledge</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="bg-[#34502b]/10 mx-auto md:mx-0">
          <TabsTrigger 
            value="yearly" 
            className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          >
            Yearly View
          </TabsTrigger>
          <TabsTrigger 
            value="trends" 
            className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white"
          >
            Trends View
          </TabsTrigger>
        </TabsList>
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
          <SidebarControls
            activeTab={activeTab}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            terms={terms}
            selectedTerms={selectedTerms}
            onTermsChange={setSelectedTerms}
            countries={countries}
          />
          
          <div className="md:col-span-3">
            <TabsContent value="yearly" className="mt-0">
              <KnowledgeChart
                data={knowledgeData}
                selectedYear={selectedYear}
                country={selectedCountry}
                selectedTerms={selectedTerms}
              />
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <KnowledgeTrendChart
                data={knowledgeData}
                selectedTerms={selectedTerms}
                country={selectedCountry}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MainContent;
