
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useCategoryChartOptions } from '../hooks/useCategoryChartOptions';

interface ImpactCategoryChartProps {
  data: Record<string, Record<string, Record<string, number>>>;
  selectedYear: number | null;
  selectedLevels: string[];
}

const ImpactCategoryChart: React.FC<ImpactCategoryChartProps> = ({
  data,
  selectedYear,
  selectedLevels
}) => {
  // Transform data into the format expected by the chart
  const chartData = React.useMemo(() => {
    if (!selectedYear || !data) return [];
    
    const result: Array<{ name: string; value: number; category: string }> = [];
    
    // Process the data structure into the flat array format needed by the chart
    Object.keys(data).forEach(category => {
      if (data[category] && data[category][selectedYear]) {
        Object.keys(data[category][selectedYear]).forEach(level => {
          if (selectedLevels.includes(level)) {
            result.push({
              name: category,
              value: data[category][selectedYear][level] * 100, // Convert to percentage
              category: level
            });
          }
        });
      }
    });
    
    return result;
  }, [data, selectedYear, selectedLevels]);
  
  const chartOptions = useCategoryChartOptions(chartData, selectedYear, selectedLevels);
  
  // Add debug logging to track rendering
  useEffect(() => {
    console.log('Category Chart rendering with data:', chartData.length, 'items');
  }, [chartData.length]);

  return (
    <div className="h-[400px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        immutable={true} // This ensures that only changed options trigger re-renders
        constructorType={'chart'}
      />
    </div>
  );
};

export default React.memo(ImpactCategoryChart);
