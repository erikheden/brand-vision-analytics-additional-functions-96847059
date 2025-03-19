import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createBarChartOptions } from '@/utils/chartConfigs';
import { BAR_COLOR, FONT_FAMILY } from '@/utils/constants';

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
  
  console.log("Using data year for bar chart:", displayYear, "Projected:", isProjected);
  
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
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
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
        return `<b>${this.key}</b>: ${value}`;
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
