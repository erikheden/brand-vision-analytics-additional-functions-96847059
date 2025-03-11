
import { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
import { FONT_FAMILY } from '@/utils/constants';
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, ArrowLeft, ArrowRight } from "lucide-react";

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
  
  // We'll use these state variables to control the visible range of years
  const [visibleYearStart, setVisibleYearStart] = useState<number>(yearRange.earliest);
  const [visibleYearEnd, setVisibleYearEnd] = useState<number>(latestYearToShow);
  const [zoomLevel, setZoomLevel] = useState<number>(3); // Default shows all years
  
  // Calculate the maximum possible range
  const totalYearSpan = latestYearToShow - yearRange.earliest;
  
  // Helper function to update the visible range when zooming
  const handleZoom = (zoomIn: boolean) => {
    // Don't allow zooming in too much (minimum 3 years visible)
    if (zoomIn && (visibleYearEnd - visibleYearStart) <= 3) return;
    
    // Don't allow zooming out beyond the total data range
    if (!zoomIn && zoomLevel >= totalYearSpan) return;
    
    const newZoomLevel = zoomIn ? zoomLevel - 1 : zoomLevel + 1;
    setZoomLevel(newZoomLevel);
    
    // Calculate new visible range based on zoom level
    const visibleYears = Math.min(Math.max(3, newZoomLevel), totalYearSpan);
    const midPoint = (visibleYearStart + visibleYearEnd) / 2;
    
    let newStart = Math.floor(midPoint - visibleYears / 2);
    let newEnd = Math.ceil(midPoint + visibleYears / 2);
    
    // Ensure we don't go beyond the data boundaries
    if (newStart < yearRange.earliest) {
      newStart = yearRange.earliest;
      newEnd = newStart + visibleYears;
    }
    
    if (newEnd > latestYearToShow) {
      newEnd = latestYearToShow;
      newStart = newEnd - visibleYears;
    }
    
    setVisibleYearStart(newStart);
    setVisibleYearEnd(newEnd);
  };
  
  // Helper function to slide the visible range
  const handleSlide = (direction: 'left' | 'right') => {
    const visibleYears = visibleYearEnd - visibleYearStart;
    const slideAmount = Math.max(1, Math.floor(visibleYears / 3));
    
    if (direction === 'left' && visibleYearStart > yearRange.earliest) {
      const newStart = Math.max(yearRange.earliest, visibleYearStart - slideAmount);
      const newEnd = newStart + visibleYears;
      setVisibleYearStart(newStart);
      setVisibleYearEnd(newEnd);
    } else if (direction === 'right' && visibleYearEnd < latestYearToShow) {
      const newEnd = Math.min(latestYearToShow, visibleYearEnd + slideAmount);
      const newStart = newEnd - visibleYears;
      setVisibleYearStart(newStart);
      setVisibleYearEnd(newEnd);
    }
  };
  
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
      zooming: {
        type: 'x',
        enabled: true
      }
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
      min: visibleYearStart,
      max: visibleYearEnd,
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
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="h-[500px] w-full">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </ChartContainer>
      
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleSlide('left')}
            disabled={visibleYearStart <= yearRange.earliest}
            className="bg-white hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-[#34502b]" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleZoom(false)}
            disabled={zoomLevel >= totalYearSpan}
            className="bg-white hover:bg-gray-100"
          >
            <ZoomOut className="h-5 w-5 text-[#34502b]" />
          </Button>
          
          <div className="px-2 py-1 bg-white border rounded text-sm text-[#34502b] min-w-20 text-center">
            {visibleYearStart} - {visibleYearEnd}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleZoom(true)}
            disabled={(visibleYearEnd - visibleYearStart) <= 3}
            className="bg-white hover:bg-gray-100"
          >
            <ZoomIn className="h-5 w-5 text-[#34502b]" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleSlide('right')}
            disabled={visibleYearEnd >= latestYearToShow}
            className="bg-white hover:bg-gray-100"
          >
            <ArrowRight className="h-5 w-5 text-[#34502b]" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandChart;
