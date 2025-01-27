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
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig }: BrandChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  const series = createSeriesConfig(selectedBrands, chartData);

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line'
    },
    xAxis: {
      ...baseOptions.xAxis,
      min: yearRange.earliest,
      max: yearRange.latest,
      allowDecimals: false,
      labels: {
        style: {
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