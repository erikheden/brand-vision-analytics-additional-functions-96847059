
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
  standardized: boolean; // Kept for API compatibility but ignored
  displayYear: number;
  averageScore: number | null;
  marketDataCount?: string | number;
}

const BrandBarChartContent: React.FC<BrandBarChartContentProps> = ({
  chartData,
  selectedBrands,
  chartConfig,
  standardized, // Always treated as false
  displayYear,
  averageScore,
  marketDataCount = 0
}) => {
  const baseOptions = createBarChartOptions(FONT_FAMILY);
  const dataToUse = chartData.filter(point => point.year === displayYear);

  // Create the series data (now sorted high to low)
  const seriesData = prepareSeriesData(dataToUse, selectedBrands, chartConfig);

  // Create the y-axis configuration with proper market average handling
  const yAxisConfig = createYAxisConfig(false, averageScore);

  // Create the chart title with appropriate market data indicator
  const titleText = createChartTitle(displayYear, false, marketDataCount);

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
      useHTML: true,
      formatter: createTooltipFormatter(false, averageScore),
      backgroundColor: 'white',
      borderColor: 'rgba(52, 80, 43, 0.2)',
      borderRadius: 4,
      borderWidth: 1,
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        pointPadding: 0.2,
        groupPadding: 0.1
      },
      series: {
        borderWidth: 0,
        animation: true
      }
    },
    series: [{
      type: 'column',
      name: 'Score',
      data: seriesData,
      colorByPoint: true
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
