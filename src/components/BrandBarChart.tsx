
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
}

const BrandBarChart = ({ chartData, selectedBrands, chartConfig, standardized, latestYear = 2024 }: BrandBarChartProps) => {
  const baseOptions = createBarChartOptions(FONT_FAMILY);
  
  const latestData = chartData
    .filter(point => point.year === latestYear)
    .sort((a, b) => {
      const scoreA = selectedBrands.map(brand => a[brand]).find(score => score !== undefined) || 0;
      const scoreB = selectedBrands.map(brand => b[brand]).find(score => score !== undefined) || 0;
      return scoreB - scoreA;
    });

  const seriesData = selectedBrands.map(brand => ({
    name: brand,
    y: latestData[0]?.[brand] || 0,
    color: BAR_COLOR
  })).sort((a, b) => b.y - a.y);

  const options: Highcharts.Options = {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'column',
    },
    title: {
      text: `${latestYear} ${standardized ? 'Standardized Brand Scores Comparison' : 'Brand Scores Comparison'}`,
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
    legend: {
      enabled: false
    },
    tooltip: {
      formatter: function() {
        const value = standardized ? 
          `${this.y?.toFixed(2)} SD` : 
          this.y?.toFixed(2);
        return `<b>${this.key}</b>: ${value}`;
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
