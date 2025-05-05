
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
    
    console.log(`SingleCountryChart: Processing ${yearData.length} data points for ${country}, year ${selectedYear}`);
    
    if (yearData.length === 0) {
      console.log(`No data found for ${country} in year ${selectedYear}`);
      return [];
    }
    
    // Log sample data to verify structure
    if (yearData.length > 0) {
      console.log(`Sample data point:`, yearData[0]);
      console.log(`Percentage value type:`, typeof yearData[0].percentage);
    }
    
    // Create data sorted by percentage in descending order
    return yearData
      .sort((a, b) => b.percentage - a.percentage)
      .map(item => ({
        name: item.medium || item.english_label_short,
        percentage: item.percentage // Keep as decimal - will be converted to percentage in chart options
      }));
  }, [data, selectedYear, country]);

  console.log(`Processed chart data for ${country}:`, chartData);

  // Determine whether we need to show the empty state
  const showEmptyState = useMemo(() => chartData.length === 0, [chartData]);
  
  // Create empty state component
  const emptyStateContent = useMemo(() => {
    if (showEmptyState) {
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
  }, [showEmptyState, country, selectedYear, isCompact]);

  // If no data, return the empty state component
  if (showEmptyState) {
    return emptyStateContent;
  }

  // Generate chart options with stable identity
  const chartKey = `${country}-${selectedYear}-${chartData.length}`;
  const options = useMemo(() => {
    console.log(`Creating chart options for ${country}, ${selectedYear} with ${chartData.length} items`);
    return createSingleCountryChartOptions(chartData, selectedYear, country, isCompact);
  }, [chartData, selectedYear, country, isCompact]);

  // For compact mode, return just the chart
  if (isCompact) {
    return <HighchartsReact 
      highcharts={Highcharts} 
      options={options} 
      key={chartKey}
    />;
  }

  // For regular mode, include the card wrapper
  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="h-[500px]">
        <HighchartsReact 
          highcharts={Highcharts} 
          options={options} 
          key={chartKey}
        />
      </div>
    </Card>
  );
};

export default SingleCountryChart;
