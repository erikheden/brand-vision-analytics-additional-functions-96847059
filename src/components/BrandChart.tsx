import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
import { createSeriesConfig } from '@/utils/seriesConfigs';
import { createTooltipFormatter } from './ChartTooltip';
import { FONT_FAMILY } from '@/utils/constants';

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean;
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig, standardized }: BrandChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  const series = createSeriesConfig(selectedBrands, chartData);

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line'
    },
    title: {
      text: standardized ? 'Standardized Brand Score Trends' : 'Brand Score Trends',
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
    xAxis: {
      ...baseOptions.xAxis,
      min: yearRange.earliest,
      max: yearRange.latest,
      allowDecimals: false,
      labels: {
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      }
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: createTooltipFormatter(FONT_FAMILY, standardized)
    },
    series
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

export default BrandChart;