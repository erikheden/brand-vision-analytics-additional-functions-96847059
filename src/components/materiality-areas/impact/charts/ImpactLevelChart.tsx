
import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useLevelChartOptions } from '../hooks/useLevelChartOptions';

interface ImpactLevelChartProps {
  data: Array<{ name: string; value: number; category: string }>;
  selectedYear: number | null;
}

const ImpactLevelChart: React.FC<ImpactLevelChartProps> = ({
  data,
  selectedYear
}) => {
  const chartOptions = useLevelChartOptions(data, selectedYear);
  
  // Add debug logging to track rendering and data
  useEffect(() => {
    console.log('Level Chart rendering with data:', data.length, 'items');
    if (data.length > 0 && data.length < 10) {
      console.log('Sample data:', data.slice(0, 2));
    }
  }, [data]);

  return (
    <div className="h-[400px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
        immutable={true} // This ensures that only changed options trigger re-renders
        constructorType={'chart'}
        callback={(chart) => {
          // Force reflow to ensure chart is properly sized and rendered
          setTimeout(() => {
            if (chart && typeof chart.reflow === 'function') {
              chart.reflow();
            }
          }, 100);
        }}
      />
    </div>
  );
};

// Use React.memo with a custom comparison function to prevent unnecessary re-renders
export default React.memo(ImpactLevelChart, (prevProps, nextProps) => {
  // Only re-render if data length changes or selected year changes
  const dataUnchanged = 
    prevProps.data.length === nextProps.data.length && 
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  const yearUnchanged = prevProps.selectedYear === nextProps.selectedYear;
  
  return dataUnchanged && yearUnchanged;
});
