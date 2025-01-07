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

const BrandBarChart = ({ chartData, selectedBrands, chartConfig }: BrandBarChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  
  // Filter and sort data for 2024
  const latestData = chartData
    .filter(point => point.year === 2024)
    .sort((a, b) => {
      const scoreA = selectedBrands.map(brand => a[brand]).find(score => score !== undefined) || 0;
      const scoreB = selectedBrands.map(brand => b[brand]).find(score => score !== undefined) || 0;
      return scoreA - scoreB;
    });

  // Create sorted series data
  const seriesData = selectedBrands.map(brand => ({
    name: brand,
    y: latestData[0]?.[brand] || 0,
    color: chartConfig[brand]?.color
  })).sort((a, b) => a.y - b.y);

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'column'
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
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </ChartContainer>
  );
};

export default BrandBarChart;