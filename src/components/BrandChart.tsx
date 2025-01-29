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
  marketAverages: { year: number; score: number; }[];
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig, marketAverages }: BrandChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  const series: Highcharts.SeriesOptionsType[] = [
    ...createSeriesConfig(selectedBrands, chartData),
    {
      type: 'line' as const,
      name: 'Market Average',
      data: marketAverages
        .map(point => [point.year, point.score])
        .filter(([year]) => year >= yearRange.earliest && year <= yearRange.latest),
      dashStyle: 'Dash',
      color: '#ffffff',
      lineWidth: 1,
      marker: {
        symbol: 'circle',
        radius: 3
      }
    }
  ];

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line'
    },
    title: {
      text: 'Brand Score Trends',
      style: {
        color: '#ffffff',
        fontFamily: FONT_FAMILY
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
      formatter: createTooltipFormatter(FONT_FAMILY)
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