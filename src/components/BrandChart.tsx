
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';
import { FONT_FAMILY } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { getAverageScore } from '@/utils/countryComparison/averageScoreUtils';

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean;
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig, standardized }: BrandChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  const [yearlyAverages, setYearlyAverages] = useState<{year: number, average: number}[]>([]);
  
  const latestYearToShow = 2025;
  
  // Get country from the first data point (all points should have same country)
  const country = chartData.length > 0 && chartData[0].country 
    ? chartData[0].country 
    : '';
  
  // Extract average scores for each year
  useEffect(() => {
    if (chartData.length > 0 && !standardized && country) {
      // Check if averageScores are attached to the chart data
      const averageScores = (chartData as any).averageScores;
      
      if (averageScores) {
        // Get all years from the chart data
        const years = chartData.map(point => point.year);
        const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
        
        // Get average score for each year
        const averagesByYear = uniqueYears.map(year => {
          const avgScore = getAverageScore(averageScores, country, year);
          return {year, average: avgScore !== null ? avgScore : 0};
        }).filter(item => item.average > 0);
        
        setYearlyAverages(averagesByYear);
        console.log("Yearly average scores for line chart:", averagesByYear);
      } else {
        setYearlyAverages([]);
      }
    } else {
      setYearlyAverages([]);
    }
  }, [chartData, country, standardized]);
  
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
  
  // Add average score series if not standardized
  if (!standardized && yearlyAverages.length > 0) {
    // Add the average score as a new series with correct typing
    const averageData = yearlyAverages.map(item => ({
      x: item.year,
      y: item.average,
      marker: {
        fillColor: '#34502b',
        lineWidth: 2,
        lineColor: '#ffffff',
        radius: 4
      }
    }));

    // Make sure to define all required properties explicitly
    series.push({
      type: 'line' as const,
      name: 'Country Average',
      data: averageData,
      color: '#34502b',
      // Use the proper typing for dashStyle
      dashStyle: 'Dash' as Highcharts.DashStyleValue,
      marker: {
        symbol: 'diamond',
        radius: 3
      },
      lineWidth: 1.5,
      zIndex: 1,
      connectNulls: false
    });
  }

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line',
      backgroundColor: '#ffffff', // Changed from #f5f5f5 to white
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
        
        // Find average for this year if available
        let averageForYear: number | null = null;
        if (!standardized && yearlyAverages.length > 0) {
          const yearAverage = yearlyAverages.find(item => item.year === pointYear);
          if (yearAverage) {
            averageForYear = yearAverage.average;
          }
        }
        
        let pointsHtml = points.map(point => {
          // Skip the average line in the individual points section
          if (point.series.name === 'Country Average') return '';
          
          const color = point.series.color;
          const value = standardized ? 
            `${point.y?.toFixed(2)} SD` : 
            point.y?.toFixed(2);
          
          // Add difference from average if available
          let diffText = '';
          if (!standardized && averageForYear !== null && point.series.name !== 'Country Average') {
            const diff = (point.y as number) - averageForYear;
            diffText = `<span style="font-size: 0.85em; margin-left: 5px; color: ${diff >= 0 ? '#34502b' : '#b74134'}">(${diff >= 0 ? '+' : ''}${diff.toFixed(2)})</span>`;
          }
          
          return `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
              <span style="color: #34502b;">${point.series.name}:</span>
              <span style="font-weight: bold; color: #34502b;">${value}${diffText}</span>
            </div>
          `;
        }).join('');
        
        // Add average line info if available
        if (!standardized && averageForYear !== null) {
          pointsHtml = `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0; border-top: 1px dotted #34502b; padding-top: 4px;">
              <div style="width: 10px; height: 1px; background-color: #34502b; border-radius: 0;"></div>
              <span style="color: #34502b; font-style: italic;">Country Average:</span>
              <span style="font-weight: bold; color: #34502b;">${averageForYear.toFixed(2)}</span>
            </div>
          ` + pointsHtml;
        }
        
        const yearLabel = `${pointYear}`;
        
        return `
          <div style="font-family: '${FONT_FAMILY}'; padding: 8px; background: #ffffff; border: 1px solid rgba(52, 80, 43, 0.2); border-radius: 4px;">
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
