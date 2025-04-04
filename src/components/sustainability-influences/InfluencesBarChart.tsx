
import React from 'react';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/useSustainabilityInfluences';
import SingleCountryChart from './charts/SingleCountryChart';
import MultiCountryChart from './charts/MultiCountryChart';

interface InfluencesBarChartProps {
  data: Record<string, InfluenceData[]>;
  selectedYear: number;
  countries: string[];
}

const InfluencesBarChart: React.FC<InfluencesBarChartProps> = ({
  data,
  selectedYear,
  countries
}) => {
  // Display empty state if no countries selected
  if (countries.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year or country.
        </div>
      </Card>
    );
  }

  // Render single country or multi-country chart based on selection
  return countries.length === 1 
    ? (
      <SingleCountryChart 
        data={data[countries[0]] || []} 
        selectedYear={selectedYear} 
        country={countries[0]} 
      />
    ) : (
      <MultiCountryChart 
        data={data} 
        selectedYear={selectedYear} 
        countries={countries} 
      />
    );
};

export default InfluencesBarChart;
