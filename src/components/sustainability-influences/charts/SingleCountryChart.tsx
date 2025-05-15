
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { getFullCountryName } from '@/components/CountrySelect';
import StandardSingleEntityChart from '@/components/charts/StandardSingleEntityChart';

export interface ChartDataItem {
  name: string;
  percentage: number;
  category?: string;
}

interface SingleCountryChartProps {
  data: InfluenceData[];
  selectedYear: number;
  country: string;
  isCompact?: boolean;
}

const SingleCountryChart: React.FC<SingleCountryChartProps> = ({
  data,
  selectedYear,
  country,
  isCompact = false
}) => {
  // Process data for the chart
  const chartData = useMemo(() => {
    // Filter data for selected year
    const yearData = data.filter(item => item.year === selectedYear);
    
    // Map to the format needed by the chart
    const processedData = yearData.map(item => ({
      name: item.english_label_short,
      value: item.percentage,
      category: item.medium
    }));
    
    // Sort by percentage (highest first)
    return [...processedData].sort((a, b) => b.value - a.value);
  }, [data, selectedYear]);

  const countryName = getFullCountryName(country);

  // If no data, render empty state
  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No data available for {countryName} in {selectedYear}.
        </div>
      </Card>
    );
  }

  return (
    <StandardSingleEntityChart
      title={`${isCompact ? '' : 'Sustainability Influences in '}${countryName} (${selectedYear})`}
      data={chartData}
      horizontal={true}
      isPercentage={true}
      height={isCompact ? 300 : 500}
      colorByPoint={true}
    />
  );
};

export default SingleCountryChart;
