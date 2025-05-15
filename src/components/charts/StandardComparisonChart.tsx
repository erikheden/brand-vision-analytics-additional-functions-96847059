
import React from 'react';
import StandardBarChart, { StandardChartSeries } from './StandardBarChart';
import { getFullCountryName } from '@/components/CountrySelect';

interface StandardComparisonChartProps {
  title: string;
  subtitle?: string;
  categories: string[];
  data: Record<string, Record<string, number>>;
  selectedEntities: string[];
  year?: number;
  horizontal?: boolean;
  isPercentage?: boolean;
  height?: number;
  emptyMessage?: string;
  formatEntityName?: (name: string) => string;
}

/**
 * StandardComparisonChart is a specialized version of StandardBarChart
 * for comparing data across multiple entities (e.g., countries)
 */
const StandardComparisonChart: React.FC<StandardComparisonChartProps> = ({
  title,
  subtitle,
  categories,
  data,
  selectedEntities,
  year,
  horizontal = false,
  isPercentage = true,
  height,
  emptyMessage = "Please select at least one item to display data.",
  formatEntityName = getFullCountryName
}) => {
  // Format the title to include year if provided
  const formattedTitle = year ? `${title} (${year})` : title;
  
  // Generate the subtitle based on selected entities count if not provided
  const generatedSubtitle = subtitle || 
    (selectedEntities.length > 0 
      ? `Comparing ${selectedEntities.length} ${selectedEntities.length === 1 ? 'item' : 'items'}`
      : '');
  
  // Process data into series format
  const series: StandardChartSeries[] = selectedEntities.map(entity => {
    const entityData = data[entity] || {};
    
    return {
      name: formatEntityName(entity),
      data: categories.map(category => entityData[category] || 0)
    };
  });
  
  // Custom validation function to check if we have data
  const validateData = (chartSeries: StandardChartSeries[]) => {
    if (chartSeries.length === 0) return false;
    
    // Check if at least one series has non-zero data
    return chartSeries.some(s => 
      s.data.some(value => 
        typeof value === 'number' ? value > 0 : value.value > 0
      )
    );
  };

  return (
    <StandardBarChart
      title={formattedTitle}
      subtitle={generatedSubtitle}
      categories={categories}
      series={series}
      horizontal={horizontal}
      isPercentage={isPercentage}
      height={height}
      emptyMessage={emptyMessage}
      validateData={validateData}
    />
  );
};

export default StandardComparisonChart;
