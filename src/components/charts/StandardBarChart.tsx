
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import {
  createStandardChartOptions,
  createPercentageChartOptions,
  getChartHeight,
  getGradientColors,
  getSeriesColors
} from '@/utils/charts/standardChartConfig';

export interface StandardChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface StandardChartSeries {
  name: string;
  data: (number | StandardChartDataPoint)[];
  color?: string;
}

interface StandardBarChartProps {
  // Chart content
  title: string;
  subtitle?: string;
  categories: string[];
  series: StandardChartSeries[];
  
  // Chart appearance
  horizontal?: boolean;
  isPercentage?: boolean;
  height?: number;
  colorByPoint?: boolean;
  
  // Display options
  showDataLabels?: boolean;
  minHeight?: number;
  className?: string;
  emptyMessage?: string;
  
  // Data validation
  validateData?: (data: StandardChartSeries[]) => boolean;
}

/**
 * StandardBarChart is a reusable component for consistent bar/column charts
 * across the application, supporting both single and multi-series data.
 */
const StandardBarChart: React.FC<StandardBarChartProps> = ({
  title,
  subtitle,
  categories,
  series,
  horizontal = false,
  isPercentage = false,
  height,
  colorByPoint = false,
  showDataLabels = true,
  minHeight = 300,
  className = "",
  emptyMessage = "No data available for the selected parameters.",
  validateData
}) => {
  // Validate if we have data to display
  const hasValidData = validateData 
    ? validateData(series) 
    : series.length > 0 && series.some(s => s.data && s.data.length > 0);

  if (!hasValidData) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="flex justify-center items-center h-60">
          <Alert className="max-w-md mx-auto bg-yellow-50">
            <Info className="h-4 w-4" />
            <AlertDescription>{emptyMessage}</AlertDescription>
          </Alert>
        </div>
      </Card>
    );
  }
  
  // Extract all values to calculate Y-axis for percentage charts
  const allValues: number[] = series.flatMap(s => 
    s.data.map(d => typeof d === 'number' ? d : d.value)
  );
  
  // Create base options based on whether it's percentage data or not
  const baseOptions = isPercentage
    ? createPercentageChartOptions(title, subtitle, horizontal, allValues)
    : createStandardChartOptions(title, subtitle, horizontal);
  
  // Calculate height if not explicitly provided
  const calculatedHeight = height || getChartHeight(categories.length, horizontal, minHeight);
  
  // Process series data to ensure proper format for Highcharts
  const processedSeries = series.map((s, index) => {
    // Process single series data
    let processedData;
    let seriesColor = s.color;
    
    if (colorByPoint && series.length === 1) {
      // For single series with colorByPoint, assign colors to individual points
      const colors = getGradientColors(s.data.length);
      processedData = s.data.map((d, i) => {
        if (typeof d === 'number') {
          return { y: d, color: colors[i] };
        } else {
          return { name: d.name, y: d.value, color: d.color || colors[i] };
        }
      });
    } else {
      // For multi-series or without colorByPoint
      seriesColor = s.color || getSeriesColors([index])[0];
      processedData = s.data.map(d => {
        if (typeof d === 'number') {
          return d;
        } else {
          return { name: d.name, y: d.value, color: d.color };
        }
      });
    }
    
    return {
      name: s.name,
      type: horizontal ? 'bar' : 'column',
      data: processedData,
      color: seriesColor,
      colorByPoint: colorByPoint && series.length === 1
    };
  });
  
  // Final chart options
  const chartOptions: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      height: calculatedHeight
    },
    xAxis: {
      ...baseOptions.xAxis,
      categories
    },
    plotOptions: {
      ...baseOptions.plotOptions,
      series: {
        ...baseOptions.plotOptions?.series,
      },
      bar: {
        ...baseOptions.plotOptions?.bar,
        dataLabels: {
          ...baseOptions.plotOptions?.bar?.dataLabels,
          enabled: horizontal && showDataLabels
        }
      },
      column: {
        ...baseOptions.plotOptions?.column,
        dataLabels: {
          ...baseOptions.plotOptions?.column?.dataLabels,
          enabled: !horizontal && showDataLabels
        }
      }
    },
    series: processedSeries as any
  };

  return (
    <Card className={`p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md ${className}`}>
      <div style={{ height: calculatedHeight }}>
        <HighchartsReact 
          highcharts={Highcharts} 
          options={chartOptions}
          immutable={false}
          containerProps={{ className: 'standard-chart-container' }}
        />
      </div>
    </Card>
  );
};

export default StandardBarChart;
