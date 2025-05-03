
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from "@/utils/constants";
import { createBrandSeries, createAverageScoreSeries } from '@/utils/charts/createChartSeries';
import { useAverageScores } from '@/hooks/useAverageScores';

interface LineChartDisplayProps {
  processedData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
  standardized: boolean;
}

const LineChartDisplay = ({
  processedData,
  selectedBrands,
  yearRange,
  chartConfig,
  standardized
}: LineChartDisplayProps) => {
  // Get country from the first data point
  const country = processedData.length > 0 && processedData[0].country 
    ? processedData[0].country 
    : '';
  
  // Extract yearly averages
  const yearlyAverages = useAverageScores(processedData, country, false);
  
  // Create series for the brands
  const brandSeries = useMemo(() => (
    createBrandSeries(processedData, selectedBrands, chartConfig)
  ), [processedData, selectedBrands, chartConfig]);
  
  // Create and add the average score series if available
  const series = useMemo(() => {
    const result = [...brandSeries];
    
    // Only add market average if we have data
    if (yearlyAverages.length > 0) {
      const averageSeries = createAverageScoreSeries(yearlyAverages);
      if (averageSeries) {
        result.push(averageSeries as Highcharts.SeriesOptionsType);
      }
    }
    
    return result;
  }, [brandSeries, yearlyAverages]);
  
  // Create chart options
  const chartOptions = useMemo(() => {
    return {
      chart: {
        type: 'line',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: 'Brand Score Trends',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        title: {
          text: 'Year'
        },
        min: yearRange.earliest,
        max: yearRange.latest
      },
      yAxis: {
        title: {
          text: 'Score'
        }
      },
      tooltip: {
        shared: true,
        formatter: function() {
          let tooltip = `<b>Year: ${this.x}</b><br/>`;
          
          this.points.forEach(point => {
            tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${Math.round(point.y * 100) / 100}<br/>`;
          });
          
          return tooltip;
        }
      },
      plotOptions: {
        line: {
          marker: {
            enabled: true
          }
        }
      },
      legend: {
        enabled: true
      },
      credits: {
        enabled: false
      },
      series: series
    };
  }, [series, yearRange, FONT_FAMILY]);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-[31px]">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={chartOptions}
      />
    </Card>
  );
};

export default LineChartDisplay;
