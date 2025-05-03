
import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { FONT_FAMILY } from '@/utils/constants';

interface BarChartDisplayProps {
  processedData: any;
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean;
  hasAverageScores: boolean;
}

const BarChartDisplay = ({
  processedData,
  selectedBrands,
  chartConfig,
  standardized,
  hasAverageScores
}: BarChartDisplayProps) => {
  // Transform data for Highcharts
  const chartOptions = useMemo(() => {
    // Extract all unique years from data
    const years = Array.from(new Set(
      processedData
        .filter(item => selectedBrands.includes(item.brand))
        .map(item => item.year)
    )).sort((a, b) => Number(b) - Number(a)); // Convert to Number before subtraction
    
    if (years.length === 0) return {};
    
    // Get the latest year with data
    const latestYear = years[0];
    
    // Filter data for the latest year
    const latestYearData = processedData.filter(item => 
      item.year === latestYear && 
      selectedBrands.includes(item.brand)
    );
    
    // Calculate average score for the latest year if available
    let averageScore = 0;
    if (hasAverageScores && processedData.averageScores) {
      const countryAverages = processedData.averageScores.get(processedData[0].country);
      if (countryAverages) {
        averageScore = countryAverages.get(latestYear) || 0;
      }
    }
    
    // Sort brands by score
    latestYearData.sort((a, b) => b.score - a.score);
    
    return {
      chart: {
        type: 'bar',
        style: {
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: `Brand Comparison (${latestYear})`,
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      xAxis: {
        categories: latestYearData.map(item => item.brand),
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Score',
          align: 'high'
        }
      },
      tooltip: {
        formatter: function() {
          return `<b>${this.point.category}</b><br>${this.y}`;
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          },
          colorByPoint: true,
          colors: latestYearData.map(item => {
            const brandConfig = chartConfig[item.brand];
            return brandConfig ? brandConfig.color : '#8BA86B';
          })
        }
      },
      legend: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Score',
        data: latestYearData.map(item => item.score),
        pointWidth: 22
      }]
    };
  }, [processedData, selectedBrands, standardized, hasAverageScores, chartConfig]);

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl py-[31px]">
      <HighchartsReact 
        highcharts={Highcharts}
        options={chartOptions}
      />
    </Card>
  );
};

export default BarChartDisplay;
