
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
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
  
  const latestYearToShow = 2025;
  
  const series = selectedBrands.map((brand, index) => {
    const brandColor = chartConfig[brand]?.color || '#333333';
    
    const data = chartData
      .map(point => {
        const isProjected = point.year === 2025 && point.Projected;
        
        return {
          x: point.year,
          y: point[brand],
          isProjected
        };
      })
      .filter(point => point.y !== null && point.y !== 0 && point.y !== undefined);
    
    const formattedData = data.map(point => ({ 
      x: point.x, 
      y: point.y,
      marker: point.isProjected ? { 
        fillColor: brandColor,
        lineWidth: 2,
        lineColor: '#ffffff',
        radius: 6
      } : undefined
    }));
    
    return {
      type: 'line' as const,
      name: brand,
      data: formattedData,
      color: brandColor,
      marker: {
        symbol: 'circle',
        radius: 4
      },
      lineWidth: 2,
      connectNulls: false
    };
  });

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line',
      backgroundColor: '#f5f5f5',
    },
    title: {
      text: standardized ? 'Standardized Brand Score Trends' : 'Brand Score Trends',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    yAxis: {
      ...baseOptions.yAxis,
      title: {
        text: standardized ? 'Standardized Score' : 'Score',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    },
    xAxis: {
      ...baseOptions.xAxis,
      min: yearRange.earliest,
      max: latestYearToShow,
      allowDecimals: false,
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      lineColor: '#34502b',
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        const tooltipContext = this as unknown as { 
          points?: Highcharts.Point[],
          x?: number
        };
        
        if (!tooltipContext.points || tooltipContext.points.length === 0) return '';
    
        const points = [...tooltipContext.points].sort((a, b) => 
          ((b.y ?? 0) - (a.y ?? 0)) as number
        );
        
        const pointYear = tooltipContext.x;
        
        const pointsHtml = points.map(point => {
          const color = point.series.color;
          const value = standardized ? 
            `${point.y?.toFixed(2)} SD` : 
            point.y?.toFixed(2);
          
          return `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
              <span style="color: #34502b;">${point.series.name}:</span>
              <span style="font-weight: bold; color: #34502b;">${value}</span>
            </div>
          `;
        }).join('');
        
        const yearLabel = `${pointYear}`;
        
        return `
          <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: #f5f5f5; border-radius: 4px; border: 1px solid rgba(52, 80, 43, 0.2);">
            <div style="font-weight: bold; margin-bottom: 8px; color: #34502b;">${yearLabel}</div>
            ${pointsHtml}
          </div>
        `;
      }
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
