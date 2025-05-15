
import React, { useMemo } from 'react';
import StandardSingleEntityChart, { ChartDataItem } from '@/components/charts/StandardSingleEntityChart';

interface ImpactBarChartProps {
  data: ChartDataItem[];
  title: string;
  categories: string[];
}

const ImpactBarChart: React.FC<ImpactBarChartProps> = ({ 
  data, 
  title, 
  categories
}) => {
  // Sort data by values for consistent display
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  return (
    <div className="w-full h-full">
      <StandardSingleEntityChart
        title={title}
        data={sortedData}
        horizontal={true}
        isPercentage={true}
        height={600}
        sortByValue={true}
        sortDirection="desc"
      />
    </div>
  );
};

export default ImpactBarChart;
