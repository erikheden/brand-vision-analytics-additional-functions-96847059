
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import SelectionPanel from "../sustainability-shared/SelectionPanel";
import DiscussionTopicsChart from "./DiscussionTopicsChart";
import DiscussionTopicsComparison from "./DiscussionTopicsComparison";
import { useAllDiscussionTopicsData } from "@/hooks/useDiscussionTopicsData";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import YearSelector from "@/components/sustainability-priorities/YearSelector";
import SustainabilityLayout from "../sustainability-shared/SustainabilityLayout";
import EmptySelection from "./EmptySelection";

const DiscussionsContent = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  
  const { data: allCountriesData = [], isLoading, error } = 
    useAllDiscussionTopicsData(selectedCountries);
    
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  const SelectionPanelContent = (
    <SelectionPanel
      title="Select Countries"
      description="Select one or more countries to view and compare sustainability discussions."
      selectedCountries={selectedCountries}
      setSelectedCountries={setSelectedCountries}
    />
  );

  const MainContent = () => {
    if (selectedCountries.length === 0) {
      return <EmptySelection />;
    }

    return (
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <YearSelector
            years={[2023, 2024]}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
        
        {selectedCountries.length === 1 ? (
          <DiscussionTopicsChart 
            data={allCountriesData.filter(item => item.country === selectedCountries[0])} 
            selectedYear={selectedYear}
            selectedCountry={selectedCountries[0]}
          />
        ) : (
          <DiscussionTopicsComparison 
            countriesData={allCountriesData}
            selectedCountries={selectedCountries}
            selectedYear={selectedYear}
          />
        )}
      </Card>
    );
  };

  return (
    <SustainabilityLayout
      title="Sustainability Discussions"
      description="Explore and compare sustainability discussion topics across different markets and time periods."
      selectionPanel={SelectionPanelContent}
    >
      <MainContent />
    </SustainabilityLayout>
  );
};

export default DiscussionsContent;
