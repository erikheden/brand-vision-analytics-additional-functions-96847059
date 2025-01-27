import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { createChartOptions } from '@/utils/chartConfigs';

interface BrandBarChartProps {
  chartData: any[];
  selectedBrands: string[];
  chartConfig: any;
}

const FONT_FAMILY = 'Forma DJR Display';
const BAR_COLOR = '#C5D1B0'; // Lighter sage green to contrast with dark background

const BrandBarChart = ({ chartData, selectedBrands, chartConfig }: BrandBarChartProps) => {
  const baseOptions = createChartOptions(FONT_FAMILY);
  
  const latestData = chartData
    .filter(point => point.year === 2024)
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
      backgroundColor: 'transparent',
      style: {
        fontFamily: FONT_FAMILY,
      }
    },
    title: {
      text: '2024 Brand Scores Comparison',
      style: {
        color: '#ffffff',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      },
      lineColor: '#ffffff',
      gridLineColor: 'rgba(255, 255, 255, 0.1)'
    },
    yAxis: {
      title: {
        text: 'Score',
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        style: {
          color: '#ffffff',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: 'rgba(255, 255, 255, 0.1)'
    },
    legend: {
      enabled: false // Disable the legend
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