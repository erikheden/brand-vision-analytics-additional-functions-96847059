
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { createTooltipFormatter } from "@/components/ChartTooltip";
import { getBrandColor } from "@/utils/countryChartDataUtils";
import { FONT_FAMILY } from "@/utils/constants";

interface BarChartContentProps {
  chartData: any[];
  yAxisDomain: [number, number];
  selectedBrands: string[];
  standardized: boolean;
}

export const BarChartContent = ({
  chartData,
  yAxisDomain,
  selectedBrands,
  standardized
}: BarChartContentProps) => {
  if (chartData.length === 0) {
    return <div className="text-center py-10">No data available for the selected parameters.</div>;
  }
  
  // Prepare series data for Highcharts
  const series = selectedBrands.map(brand => {
    return {
      name: brand,
      data: chartData.map(item => ({
        name: item.country,
        y: item[brand] !== undefined ? item[brand] : null,
        color: getBrandColor(brand)
      })),
      color: getBrandColor(brand)
    };
  });
  
  // Create the Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: standardized ? 'Standardized Brand Scores by Country' : 'Brand Scores by Country',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      type: 'category',
      labels: {
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      title: {
        text: 'Country',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      }
    },
    yAxis: {
      min: yAxisDomain[0],
      max: yAxisDomain[1],
      title: {
        text: standardized ? 'Standardized Score' : 'Score',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      labels: {
        format: standardized ? '{value}σ' : '{value}',
        style: {
          color: '#34502b',
          fontFamily: FONT_FAMILY
        }
      },
      gridLineColor: 'rgba(52, 80, 43, 0.1)',
      plotLines: standardized ? [{
        value: 0,
        color: '#666',
        dashStyle: 'Dash',
        width: 1
      }] : undefined
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    tooltip: {
      formatter: createTooltipFormatter(FONT_FAMILY, standardized),
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        borderRadius: 3,
        pointPadding: 0.2,
        groupPadding: 0.1
      },
      series: {
        borderWidth: 0,
        animation: true
      }
    },
    credits: {
      enabled: false
    },
    series
  };
  
  return (
    <div className="w-full h-full">
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};
