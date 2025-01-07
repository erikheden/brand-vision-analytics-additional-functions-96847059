import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from 'react';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
}

const FONT_FAMILY = 'Forma DJR Display';
const BAR_COLOR = '#b7c895'; // Soft sage green color

const BrandBarChart = ({ chartData, selectedBrands, chartConfig }: BrandBarChartProps) => {
  const chartRef = React.useRef<HighchartsReact.RefObject>(null);
  const baseOptions = createChartOptions(FONT_FAMILY);
  
  // Filter and sort data for 2024
  const latestData = chartData
    .filter(point => point.year === 2024)
    .sort((a, b) => {
      const scoreA = selectedBrands.map(brand => a[brand]).find(score => score !== undefined) || 0;
      const scoreB = selectedBrands.map(brand => b[brand]).find(score => score !== undefined) || 0;
      return scoreA - scoreB;
    });

  // Create sorted series data with consistent color
  const seriesData = selectedBrands.map(brand => ({
    name: brand,
    y: latestData[0]?.[brand] || 0,
    color: BAR_COLOR // Use the same color for all bars
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

  const handleExport = () => {
    if (chartRef.current?.chart) {
      chartRef.current.chart.exportChartLocal({
        type: 'image/png',
        filename: 'brand-comparison-2024'
      });
    }
  };

  return (
    <ChartContainer config={chartConfig} className="h-[500px] w-full">
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
    </ChartContainer>
  );
};

export default BrandBarChart;