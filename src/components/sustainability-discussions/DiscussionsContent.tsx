
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "@/components/sustainability-priorities/YearSelector";

const DiscussionsContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  const { data: allCountriesData = [], isLoading, error } = 
    useAllDiscussionTopicsData(selectedCountries);
    
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-[#34502b] mb-6">Sustainability Discussions</h1>
      
      <SelectionPanel
        title="Select Countries"
        description="Select one or more countries to view and compare sustainability discussions."
        selectedCountries={selectedCountries}
        setSelectedCountries={setSelectedCountries}
      />
      
      {selectedCountries.length > 0 && (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <YearSelector
                years={[2023, 2024]}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>
          
          {selectedCountries.length === 1 ? (
            <DiscussionTopicsChart 
              data={allCountriesData.filter(item => item.country === selectedCountries[0])} 
              selectedYear={selectedYear}
              selectedCountry={selectedCountries[0]}
            />
          ) : (
            <DiscussionTopicsComparison 
              data={allCountriesData}
              selectedCountries={selectedCountries}
              selectedYear={selectedYear}
            />
          )}
        </Card>
      )}
    </div>
  );
};

export default DiscussionsContent;
