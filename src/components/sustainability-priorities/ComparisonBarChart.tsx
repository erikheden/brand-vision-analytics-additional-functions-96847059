
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
  const sortedAreas = useMemo(() => 
    sortAreasByAverage(allAreas, areaAverages),
    [allAreas, areaAverages]
  );

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
  console.log('ComparisonBarChart - sortedAreas:', sortedAreas);
  console.log('ComparisonBarChart - series data:', series);

  // Get chart options
  const options = useMemo(() => {
    const chartOptionsComponent = (
      <ComparisonChartOptions 
        sortedAreas={sortedAreas} 
        series={series} 
        selectedYear={selectedYear} 
      />
    );
    
    // Extract options object from the component
    return chartOptionsComponent.props;
  }, [series, sortedAreas, selectedYear]);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Card>
  );
};

export default ComparisonBarChart;
