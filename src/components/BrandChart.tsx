import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
import { createSeriesConfig } from '@/utils/seriesConfigs';
import { createTooltipFormatter } from './ChartTooltip';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Import the exporting module
import HighchartsExporting from 'highcharts/modules/exporting';
// Initialize exporting module
HighchartsExporting(Highcharts);

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
}

const FONT_FAMILY = 'Forma DJR Display';

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig }: BrandChartProps) => {
  const chartRef = React.useRef<HighchartsReact.RefObject>(null);
  const baseOptions = createChartOptions(FONT_FAMILY);
  const series = createSeriesConfig(selectedBrands, chartData);

  const options: Highcharts.Options = {
    ...baseOptions,
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
    series,
    exporting: {
      enabled: true
    }
  };

  const handleExport = () => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.exportChart({}, {
        type: 'image/png',
        filename: 'brand-trends'
      });
    }
  };

  return (
    <div className="h-[500px] w-full">
      <ChartContainer config={chartConfig}>
        <div>
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export as PNG
            </Button>
          </div>
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
            ref={chartRef}
          />
        </div>
      </ChartContainer>
    </div>
  );
};

export default BrandChart;