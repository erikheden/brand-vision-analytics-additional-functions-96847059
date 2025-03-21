
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';
import { 
  createYAxisConfig, 
  createTooltipFormatter, 
  createChartTitle,
  prepareSeriesData 
} from '@/utils/charts/brandBarChartUtils';
import { createBarChartOptions } from '@/utils/chartConfigs';

interface BrandBarChartContentProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean;
  displayYear: number;
  averageScore: number | null;
  marketDataCount?: string | number;
}

const BrandBarChartContent: React.FC<BrandBarChartContentProps> = ({
  chartData,
  selectedBrands,
  chartConfig,
  standardized,
  displayYear,
  averageScore,
  marketDataCount = 0
}) => {
  const baseOptions = createBarChartOptions(FONT_FAMILY);
  const dataToUse = chartData.filter(point => point.year === displayYear);

  // Create the series data (now sorted high to low)
  const seriesData = prepareSeriesData(dataToUse, selectedBrands, chartConfig);

  // Create the y-axis configuration
  const yAxisConfig = createYAxisConfig(standardized, averageScore);

  // Create the chart title
  const titleText = createChartTitle(displayYear, standardized, marketDataCount);

  // Create the chart options
  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'column',
      backgroundColor: 'white',
    },
    title: {
      text: titleText,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    yAxis: yAxisConfig,
    xAxis: {
      type: 'category',
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      lineColor: '#34502b',
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    },
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: createTooltipFormatter(standardized, averageScore),
      backgroundColor: 'white',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    series: [{
      type: 'column',
      name: 'Score',
      data: seriesData
    }]
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default BrandBarChartContent;
