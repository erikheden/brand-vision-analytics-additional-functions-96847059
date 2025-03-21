
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { useAverageScores } from '@/hooks/useAverageScores';
import { createBrandSeries, createAverageScoreSeries } from '@/utils/charts/createChartSeries';
import { createBrandChartOptions } from '@/utils/charts/createBrandChartOptions';

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean;
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig, standardized }: BrandChartProps) => {
  // Get country from the first data point (all points should have same country)
  const country = chartData.length > 0 && chartData[0].country 
    ? chartData[0].country 
    : '';
  
  // Use the hook to extract yearly averages
  const yearlyAverages = useAverageScores(chartData, country, standardized);
  
  // Create series for the brands
  const brandSeries = createBrandSeries(chartData, selectedBrands, chartConfig);
  
  // Create and add the average score series if available
  const series = [...brandSeries];
  
  if (!standardized && yearlyAverages.length > 0) {
    const averageSeries = createAverageScoreSeries(yearlyAverages);
    if (averageSeries) {
      // Push to series after type assertion
      (series as Highcharts.SeriesOptionsType[]).push(averageSeries);
    }
  }

  // Create complete chart options with modifications for standardized mode
  const options = createBrandChartOptions(
    yearRange,
    series,
    standardized,
    yearlyAverages
  );
  
  // Add a special plot line at zero for standardized scores
  if (standardized && options.yAxis && typeof options.yAxis !== 'boolean') {
    const yAxis = Array.isArray(options.yAxis) ? options.yAxis[0] : options.yAxis;
    yAxis.plotLines = [{
      value: 0,
      color: '#666',
      width: 1,
      dashStyle: 'Dash' as Highcharts.DashStyleValue, // Fix: Use type assertion to valid DashStyleValue
      label: {
        text: 'Market Average',
        align: 'right',
        style: {
          fontStyle: 'italic',
          color: '#666'
        }
      }
    }];
    
    // Update y-axis labels for standardized values
    yAxis.labels = {
      ...yAxis.labels,
      format: '{value}σ'
    };
    
    // Update y-axis title for standardized view
    yAxis.title = {
      ...yAxis.title,
      text: 'Standard Deviations from Market Mean'
    };
    
    // Update tooltip formatter for standardized values
    if (options.tooltip) {
      const origFormatter = options.tooltip.formatter;
      options.tooltip.formatter = function() {
        // @ts-ignore - this is complex to type correctly
        const result = origFormatter ? origFormatter.call(this) : undefined;
        if (typeof result === 'string') {
          return result.replace(/(\d+\.\d+)/, '$1σ');
        }
        return result;
      };
    }
  }

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </ChartContainer>
  );
};

export default BrandChart;
