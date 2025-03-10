
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createBarChartOptions } from '@/utils/chartConfigs';
import { BAR_COLOR, FONT_FAMILY } from '@/utils/constants';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean;
  latestYear?: number;
}

const BrandBarChart = ({ chartData, selectedBrands, chartConfig, standardized, latestYear = 2025 }: BrandBarChartProps) => {
  const baseOptions = createBarChartOptions(FONT_FAMILY);
  
  // Find data for the latest year, falling back to the most recent available year if 2025 has no data
  const latestYearData = chartData.filter(point => point.year === latestYear);
  
  // If no data for the specified latest year, get the most recent year with data
  const dataToUse = latestYearData.length > 0 
    ? latestYearData 
    : chartData.length > 0 
      ? [chartData.reduce((latest, current) => latest.year > current.year ? latest : current)] 
      : [];
  
  // Sort brands by their score values
  const seriesData = selectedBrands.map(brand => {
    const scoreValue = dataToUse[0]?.[brand] || 0;
    return {
      name: brand,
      y: scoreValue,
      color: BAR_COLOR
    };
  }).sort((a, b) => b.y - a.y);

  // Get the actual year being displayed
  const displayYear = dataToUse[0]?.year || latestYear;

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'column',
    },
    title: {
      text: `${displayYear} ${standardized ? 'Standardized Brand Scores Comparison' : 'Brand Scores Comparison'}`,
      style: {
        color: '#ffffff',
        fontFamily: FONT_FAMILY
      }
    },
    yAxis: {
      ...baseOptions.yAxis,
      title: {
        text: standardized ? 'Standardized Score' : 'Score',
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      }
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        const value = standardized ? 
          `${this.y?.toFixed(2)} SD` : 
          this.y?.toFixed(2);
        return `<b>${this.key}</b>: ${value}`;
      }
    },
    series: [{
      type: 'column',
      name: 'Score',
      data: seriesData
    }]
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </ChartContainer>
  );
};

export default BrandBarChart;
