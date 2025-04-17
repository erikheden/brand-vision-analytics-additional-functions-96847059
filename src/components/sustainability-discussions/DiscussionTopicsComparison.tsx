
import React from "react";
import { Card } from "@/components/ui/card";
import { DiscussionTopicData } from "@/hooks/useDiscussionTopicsData";
import DiscussionTopicsComparisonChart from "./DiscussionTopicsComparisonChart";

interface DiscussionTopicsComparisonProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedYear: number;
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({
  data,
  selectedCountries,
  selectedYear
}) => {
  // Process data by country
  const countriesData = React.useMemo(() => {
    if (!data || data.length === 0) return {};
    
    // Group data by country
    return data.reduce((acc, item) => {
      if (!item.country) return acc;
      
      const country = item.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(item);
      return acc;
    }, {} as Record<string, DiscussionTopicData[]>);
  }, [data]);
  
  if (selectedCountries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-12 text-[#34502b]/70">
          Please select countries to compare discussion topics
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <DiscussionTopicsComparisonChart 
        countriesData={countriesData} 
        selectedYear={selectedYear}
        selectedCountries={selectedCountries}
      />
    </Card>
  );
};

export default DiscussionTopicsComparison;
