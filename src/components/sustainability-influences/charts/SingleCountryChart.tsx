
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { createSingleCountryChartOptions } from './chartOptions/singleCountryOptions';

interface SingleCountryChartProps {
  data: InfluenceData[];
  selectedYear: number;
  country: string;
  isCompact?: boolean;
}

export interface ChartDataItem {
  name: string;
  percentage: number;
}

const SingleCountryChart: React.FC<SingleCountryChartProps> = ({
  data,
  selectedYear,
  country,
  isCompact = false
}) => {
  // Filter data by selected year and process chart data using useMemo to prevent unnecessary recalculations
  const chartData = useMemo(() => {
    const yearData = data.filter(item => item.year === selectedYear);
    
    console.log(`SingleCountryChart: Found ${yearData.length} data points for ${country}, year ${selectedYear}`);
    console.log(`Data sample:`, yearData.slice(0, 2));
    
    // Create data sorted by percentage in descending order
    return yearData
      .sort((a, b) => b.percentage - a.percentage)
      .map(item => ({
        name: item.medium || item.english_label_short,
        percentage: item.percentage // No conversion needed - data is already in decimal form
      }));
  }, [data, selectedYear, country]);

  console.log(`Processed chart data for ${country}:`, chartData);

  // Empty state handling with useMemo to prevent re-rendering
  const emptyStateContent = useMemo(() => {
    if (chartData.length === 0) {
      return isCompact ? (
        <div className="text-center py-6 text-gray-500">
          No data available for {country} in {selectedYear}.
        </div>
      ) : (
        <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
          <div className="text-center py-10 text-gray-500">
            No data available for {selectedYear}. Please select a different year.
          </div>
        </Card>
      );
    }
    return null;
  }, [chartData.length, country, selectedYear, isCompact]);

  // If no data, return the empty state component
  if (chartData.length === 0) {
    return emptyStateContent;
  }

  // Generate chart options
  const options = createSingleCountryChartOptions(chartData, selectedYear, country, isCompact);

  // For compact mode, return just the chart
  if (isCompact) {
    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }

  // For regular mode, include the card wrapper
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </Card>
  );
};

export default SingleCountryChart;
