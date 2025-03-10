
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
  
  // Ensure we include 2025 in our data range
  const latestYearToShow = 2025;
  
  // Generate series data with proper handling of 2025
  const series = selectedBrands.map((brand, index) => {
    const brandColor = chartConfig[brand]?.color || '#333333';
    
    // Get all data points for this brand
    const data = chartData
      .map(point => {
        // Check if this is projected data (2025)
        const isProjected = point.year === 2025 && point.Projected;
        
        return {
          x: point.year,
          y: point[brand],
          isProjected
        };
      })
      .filter(point => point.y !== null && point.y !== 0 && point.y !== undefined);
    
    // Format data for highcharts
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
      connectNulls: false // Don't connect lines across null points
    };
  });

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
      max: latestYearToShow,
      allowDecimals: false,
      labels: {
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      },
      plotLines: [{
        color: 'rgba(255, 255, 255, 0.3)',
        dashStyle: 'Dash',
        value: 2024,
        width: 1,
        label: {
          text: 'Projected →',
          align: 'right',
          style: {
            color: '#ffffff',
            fontStyle: 'italic',
            fontFamily: FONT_FAMILY
          }
        }
      }]
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        if (!this.points) return '';
    
        const points = [...this.points].sort((a, b) => 
          ((b.y ?? 0) - (a.y ?? 0)) as number
        );
        
        const pointYear = this.x;
        const isProjectedYear = pointYear === 2025;
        
        const pointsHtml = points.map(point => {
          const color = point.series.color;
          const value = standardized ? 
            `${point.y?.toFixed(2)} SD` : 
            point.y?.toFixed(2);
          
          return `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
              <span style="color: #ffffff;">${point.series.name}:</span>
              <span style="font-weight: bold; color: #ffffff;">${value}</span>
            </div>
          `;
        }).join('');
        
        const yearLabel = isProjectedYear ? `${pointYear} (Projected)` : `${pointYear}`;
        
        return `
          <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: rgba(52, 80, 43, 0.95); border-radius: 4px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #ffffff;">${yearLabel}</div>
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
