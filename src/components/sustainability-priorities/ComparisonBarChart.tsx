
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { MaterialityData } from '@/hooks/useGeneralMaterialityData';
import ComparisonChartOptions from './ComparisonChartOptions';
import ComparisonEmptyState from './ComparisonEmptyState';
import { 
  processComparisonChartData, 
  getUniqueAreas, 
  calculateAreaAverages, 
  sortAreasByAverage, 
  prepareChartSeries 
} from '@/utils/charts/comparisonChartUtils';

interface ComparisonBarChartProps {
  allCountriesData: Record<string, MaterialityData[]>;
  selectedAreas: string[];
  selectedYear: number;
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({ 
  allCountriesData, 
  selectedAreas,
  selectedYear
}) => {
  // Process the chart data
  const chartData = useMemo(() => 
    processComparisonChartData(allCountriesData, selectedAreas, selectedYear),
    [allCountriesData, selectedAreas, selectedYear]
  );

  // Get all unique materiality areas across all countries
  const allAreas = useMemo(() => 
    getUniqueAreas(chartData),
    [chartData]
  );

  // Calculate average value for each area across all countries
  const areaAverages = useMemo(() => 
    calculateAreaAverages(chartData, allAreas),
    [chartData, allAreas]
  );
  
  // Sort areas by average value (highest first)
  const sortedAreas = useMemo(() => {
    console.log('Calling sortAreasByAverage with:', allAreas, areaAverages);
    return sortAreasByAverage(allAreas, areaAverages);
  }, [allAreas, areaAverages]);

  // Prepare series for Highcharts
  const series = useMemo(() => 
    prepareChartSeries(chartData, sortedAreas),
    [chartData, sortedAreas]
  );

  // Check if we have data to display
  if (Object.keys(chartData).length === 0 || series.length === 0) {
    return <ComparisonEmptyState selectedAreas={selectedAreas} />;
  }

  // For debugging
  console.log('ComparisonBarChart - selectedAreas:', selectedAreas);
  console.log('ComparisonBarChart - allAreas:', allAreas);
  console.log('ComparisonBarChart - sortedAreas:', sortedAreas);
  console.log('ComparisonBarChart - sortedAreas length:', sortedAreas.length);
  console.log('ComparisonBarChart - series data:', series);
  console.log('ComparisonBarChart - series length:', series.length);
  console.log('ComparisonBarChart - first series sample:', series[0]?.data?.slice(0, 3));

  // Get the chart options from the ComparisonChartOptions component
  const chartOptions = ComparisonChartOptions({ 
    sortedAreas, 
    series, 
    selectedYear 
  });

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions} 
        immutable={false}
      />
    </Card>
  );
};

export default ComparisonBarChart;
