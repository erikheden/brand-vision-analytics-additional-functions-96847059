
import React from "react";
import { Card } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import DiscussionTopicsComparisonChart from "./DiscussionTopicsComparisonChart";

interface DiscussionTopicsComparisonProps {
  countriesData: DiscussionTopicData[];
  selectedCountries: string[];
  selectedYear: number;
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({
  countriesData,
  selectedCountries,
  selectedYear
}) => {
  // Process data by country
  const countriesDataMap = React.useMemo(() => {
    if (!countriesData || countriesData.length === 0) return {};
    
    // Group data by country
    return countriesData.reduce((acc, item) => {
      if (!item.country) return acc;
      
      const country = item.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(item);
      return acc;
    }, {} as Record<string, DiscussionTopicData[]>);
  }, [countriesData]);
  
  if (selectedCountries.length === 0) {
    return (
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
        <div className="text-center py-12 text-[#34502b]/70">
          Please select countries to compare discussion topics
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-gradient-to-r from-gray-50 to-[#f1f0fb] border-2 border-[#34502b]/20 shadow-lg rounded-xl">
      <DiscussionTopicsComparisonChart 
        countriesData={countriesDataMap} 
        selectedYear={selectedYear}
        selectedCountries={selectedCountries}
      />
    </Card>
  );
};

export default DiscussionTopicsComparison;
