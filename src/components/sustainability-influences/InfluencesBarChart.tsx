
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/sustainability-influences';
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
  // Use useMemo to prevent unnecessary checks during re-renders
  const { hasData, countryData } = useMemo(() => {
    // Display empty state if no countries selected
    if (countries.length === 0) {
      return { hasData: false, countryData: {} };
    }
    
    // Debug data availability
    console.log(`InfluencesBarChart: Rendering for year ${selectedYear}, countries:`, countries);
    console.log(`Available data keys:`, Object.keys(data));
    
    // Check if we have data for the selected countries and year
    const hasData = countries.some(country => {
      const countryData = data[country] || [];
      const yearData = countryData.filter(item => item.year === selectedYear);
      console.log(`Country ${country} has ${yearData.length} data points for year ${selectedYear}`);
      return yearData.length > 0;
    });

    return { hasData, countryData: data };
  }, [data, countries, selectedYear]);
  
  if (!hasData) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {selectedYear}. Please select a different year or country.
        </div>
      </Card>
    );
  }

  // For single country, use the SingleCountryChart component
  if (countries.length === 1) {
    return (
      <SingleCountryChart 
        data={countryData[countries[0]] || []} 
        selectedYear={selectedYear} 
        country={countries[0]} 
        key={`single-country-${countries[0]}-${selectedYear}`}
      />
    );
  } 
  
  // For multiple countries, use MultiCountryChart instead of individual charts
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <MultiCountryChart
        data={countryData}
        selectedYear={selectedYear}
        countries={countries}
        key={`multi-country-${countries.join('-')}-${selectedYear}`}
      />
    </Card>
  );
};

export default InfluencesBarChart;
