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
  
  // Format market averages data for the chart
  const marketAverageData = marketAverages
    .filter(point => point.year >= yearRange.earliest && point.year <= yearRange.latest)
    .map(point => [point.year, Number(point.score)])
    .sort((a, b) => (a[0] as number) - (b[0] as number));

  console.log('Market Average Data:', marketAverageData); // Debug log

  const series: Highcharts.SeriesOptionsType[] = [
    ...createSeriesConfig(selectedBrands, chartData),
    {
      type: 'line' as const,
      name: 'Market Average',
      data: marketAverageData,
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
      type: 'line',
      backgroundColor: 'transparent'
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