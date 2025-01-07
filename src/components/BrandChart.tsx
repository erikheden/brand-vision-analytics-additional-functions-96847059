import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ChartContainer } from "@/components/ui/chart";
import { getBrandColors } from "@/utils/chartDataUtils";

interface BrandChartProps {
  chartData: any[];
  selectedBrands: string[];
  yearRange: { earliest: number; latest: number };
  chartConfig: any;
}

const BrandChart = ({ chartData, selectedBrands, yearRange, chartConfig }: BrandChartProps) => {
  const brandColors = getBrandColors();

  // Transform data for Highcharts format
  const series = selectedBrands.map((brand, index) => ({
    name: brand,
    data: chartData.map(point => [point.year, point[brand] || null]),
    color: brandColors[index % brandColors.length],
    marker: {
      symbol: 'circle',
      radius: 4
    },
    lineWidth: 2
  }));

  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      style: {
        fontFamily: 'Forma DJR Display'
      },
      backgroundColor: 'transparent'
    },
    title: {
      text: undefined
    },
    xAxis: {
      type: 'linear',
      min: yearRange.earliest,
      max: yearRange.latest,
      title: {
        text: undefined
      },
      labels: {
        style: {
          fontFamily: 'Forma DJR Display'
        }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dot'
    },
    yAxis: {
      title: {
        text: undefined
      },
      labels: {
        style: {
          fontFamily: 'Forma DJR Display'
        }
      },
      gridLineWidth: 1,
      gridLineDashStyle: 'Dot'
    },
    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function() {
        if (!this.points) return '';
        
        const sortedPoints = [...this.points].sort((a, b) => 
          (b.y ?? 0) - (a.y ?? 0)
        );

        const pointsHtml = sortedPoints.map(point => {
          const color = point.series.color;
          return `
            <div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">
              <div style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%;"></div>
              <span style="color: #666;">${point.series.name}:</span>
              <span style="font-weight: bold;">${point.y?.toFixed(2)}</span>
            </div>
          `;
        }).join('');

        return `
          <div style="font-family: 'Forma DJR Display'; padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 8px;">${this.x}</div>
            ${pointsHtml}
          </div>
        `;
      }
    },
    legend: {
      itemStyle: {
        fontFamily: 'Forma DJR Display'
      }
    },
    series: series,
    credits: {
      enabled: false
    },
    plotOptions: {
      line: {
        connectNulls: true
      },
      series: {
        animation: {
          duration: 1000
        }
      }
    }
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