
import React from 'react';
import StandardBarChart from './StandardBarChart';
import { roundPercentage } from '@/utils/formatting';

export interface ChartDataItem {
  name: string;
  value: number;
  category?: string;
}

interface StandardSingleEntityChartProps {
  title: string;
  subtitle?: string;
  data: ChartDataItem[];
  horizontal?: boolean;
  isPercentage?: boolean;
  height?: number;
  sortByValue?: boolean;
  sortDirection?: 'asc' | 'desc';
  colorByPoint?: boolean;
  emptyMessage?: string;
}

/**
 * StandardSingleEntityChart displays data for a single entity (e.g., country)
 * with one bar per category, and supports sorting by value.
 */
const StandardSingleEntityChart: React.FC<StandardSingleEntityChartProps> = ({
  title,
  subtitle,
  data,
  horizontal = true,
  isPercentage = true,
  height,
  sortByValue = true,
  sortDirection = 'desc',
  colorByPoint = true,
  emptyMessage = "No data available for the selected parameters."
}) => {
  // Sort data if requested
  const sortedData = sortByValue 
    ? [...data].sort((a, b) => {
        const multiplier = sortDirection === 'desc' ? -1 : 1;
        return multiplier * (a.value - b.value);
      })
    : data;
  
  // Format data for the chart
  const categories = sortedData.map(item => item.name);
  const series = [{
    name: 'Value',
    data: sortedData.map(item => {
      const value = isPercentage ? roundPercentage(item.value * 100) : item.value;
      return { name: item.name, value };
    })
  }];

  // Validation function
  const validateData = () => data && data.length > 0;

  return (
    <StandardBarChart
      title={title}
      subtitle={subtitle}
      categories={categories}
      series={series}
      horizontal={horizontal}
      isPercentage={isPercentage}
      height={height}
      colorByPoint={colorByPoint}
      emptyMessage={emptyMessage}
      validateData={validateData}
    />
  );
};

export default StandardSingleEntityChart;
