
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createBarChartOptions } from '@/utils/chartConfigs';
import { BAR_COLOR, FONT_FAMILY } from '@/utils/constants';
import { useEffect, useState } from 'react';
import { getAverageScore } from '@/utils/countryComparison/averageScoreUtils';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
  standardized: boolean;
  latestYear?: number;
  marketDataCount?: string | number;
}

const BrandBarChart = ({ 
  chartData, 
  selectedBrands, 
  chartConfig, 
  standardized, 
  latestYear = 2025,
  marketDataCount = 0
}: BrandBarChartProps) => {
  const baseOptions = createBarChartOptions(FONT_FAMILY);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  
  // Specifically filter for 2025 data first
  const data2025 = chartData.filter(point => point.year === 2025);
  
  // If no 2025 data exists, fall back to the most recent year data
  const dataToUse = data2025.length > 0 
    ? data2025 
    : chartData.length > 0 
      ? [chartData.reduce((latest, current) => 
          latest.year > current.year ? latest : current, chartData[0])] 
      : [];
      
  // Get the actual year being displayed (for the title)
  const displayYear = dataToUse[0]?.year || latestYear;
  const isProjected = dataToUse[0]?.Projected;
  
  // Get country from the first data point (all points should have same country)
  const country = dataToUse[0]?.country || '';
  
  console.log("Using data year for bar chart:", displayYear, "Projected:", isProjected);
  
  // Extract average score from the chart data if available
  useEffect(() => {
    if (chartData.length > 0 && !standardized) {
      // Check if averageScores are attached to the chart data
      const averageScores = (chartData as any).averageScores;
      if (averageScores && country) {
        const countryAvg = getAverageScore(averageScores, country, displayYear);
        setAverageScore(countryAvg);
        console.log(`Bar chart average score for ${country}/${displayYear}:`, countryAvg);
      } else {
        setAverageScore(null);
      }
    } else {
      setAverageScore(null);
    }
  }, [chartData, country, displayYear, standardized]);
  
  // Sort brands by their score values
  const seriesData = selectedBrands.map(brand => {
    const scoreValue = dataToUse[0]?.[brand] || 0;
    return {
      name: brand,
      y: scoreValue,
      color: BAR_COLOR
    };
  }).sort((a, b) => b.y - a.y);

  // Display the actual number of brands used for standardization
  const marketComparisonText = typeof marketDataCount === 'string'
    ? marketDataCount
    : marketDataCount > 0 
      ? `vs ${marketDataCount} brands` 
      : 'Market Standardized';

  // Create a more informative title based on standardization and market data
  const titleText = standardized 
    ? `${displayYear} Market-Relative Brand Scores (${marketComparisonText})`
    : `${displayYear} Brand Scores Comparison`;

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
    yAxis: {
      ...baseOptions.yAxis,
      title: {
        text: standardized ? 'Standard Deviations from Market Mean' : 'Score',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY,
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)',
      // Add plotLines for average score when showing raw scores
      plotLines: !standardized && averageScore ? [{
        value: averageScore,
        color: '#34502b',
        dashStyle: 'Dash',
        width: 1.5,
        label: {
          text: `Country Average: ${averageScore.toFixed(2)}`,
          align: 'right',
          style: {
            color: '#34502b',
            fontFamily: FONT_FAMILY,
            fontStyle: 'italic'
          }
        },
        zIndex: 5
      }] : undefined
    },
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
      formatter: function() {
        const value = standardized ? 
          `${this.y?.toFixed(2)} SD from market mean` : 
          this.y?.toFixed(2);
        
        let tooltipText = `<b>${this.key}</b>: ${value}`;
        
        // Add average score info if available and not standardized
        if (!standardized && averageScore !== null) {
          const diff = (this.y as number) - averageScore;
          const diffText = diff >= 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
          tooltipText += `<br/><span style="font-size: 0.9em; font-style: italic;">Difference from average: ${diffText}</span>`;
        }
        
        return tooltipText;
      },
      backgroundColor: 'white',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    series: [{
      type: 'column',
      name: 'Score',
      data: seriesData
    }]
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
    </ChartContainer>
  );
};

export default BrandBarChart;
