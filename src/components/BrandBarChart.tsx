import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
}

const FONT_FAMILY = 'Forma DJR Display';
const BAR_COLOR = '#b7c895'; // Soft sage green color

const BrandBarChart = ({ chartData, selectedBrands, chartConfig }: BrandBarChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  
  // Filter and sort data for 2024
  const latestData = chartData
    .filter(point => point.year === 2024)
    .sort((a, b) => {
      const scoreA = selectedBrands.map(brand => a[brand]).find(score => score !== undefined) || 0;
      const scoreB = selectedBrands.map(brand => b[brand]).find(score => score !== undefined) || 0;
      return scoreB - scoreA; // Changed to sort descending for vertical bars
    });

  // Create sorted series data with consistent color
  const seriesData = selectedBrands.map(brand => ({
    name: brand,
    y: latestData[0]?.[brand] || 0,
    color: BAR_COLOR // Use the same color for all bars
  })).sort((a, b) => b.y - a.y); // Changed to sort descending for vertical bars

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'column',
      inverted: false // Set to false for vertical bars
    },
    title: {
      text: '2024 Brand Scores Comparison',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      title: {
        text: 'Score',
        style: {
          fontFamily: FONT_FAMILY
        }
      }
    },
    series: [{
      name: 'Score',
      data: seriesData,
      type: 'column'
    }],
    plotOptions: {
      column: {
        borderRadius: 5
      }
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
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