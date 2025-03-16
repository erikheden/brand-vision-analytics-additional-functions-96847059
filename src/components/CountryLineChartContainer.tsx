
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { ChartTooltip, createTooltipFormatter } from "./ChartTooltip";
import { MultiCountryData } from "@/hooks/useMultiCountryChartData";
import { FONT_FAMILY } from "@/utils/constants";
import CountryListDisplay from "./CountryListDisplay";
import { useCountryLineChart } from "@/hooks/useCountryLineChart";

interface CountryLineChartContainerProps {
  chartData: any[];
  selectedBrands: string[];
  allCountriesData: MultiCountryData;
  standardized: boolean;
}

const CountryLineChartContainer: React.FC<CountryLineChartContainerProps> = ({
  chartData,
  selectedBrands,
  allCountriesData,
  standardized
}) => {
  const {
    countries,
    yAxisDomain,
    lines,
    minYear,
    maxYear
  } = useCountryLineChart(chartData, selectedBrands, allCountriesData, standardized);
  
  console.log("Chart data in container:", chartData.length, "points");
  console.log("First data point:", chartData.length > 0 ? JSON.stringify(chartData[0]) : "No data");
  console.log("Chart lines in container:", JSON.stringify(lines, null, 2));
  console.log("Y-axis domain:", yAxisDomain);
  console.log("X-axis range:", minYear, "to", maxYear);
  
  if (!chartData || chartData.length === 0) {
    return <div className="text-center py-8">No chart data available.</div>;
  }
  
  if (!lines || lines.length === 0) {
    return <div className="text-center py-8">No valid data found to display chart lines.</div>;
  }

  // Create series data for Highcharts with proper typing
  const series: Highcharts.SeriesOptionsType[] = lines.map(line => {
    const seriesData = chartData.map(point => {
      // Only include points that have a non-zero and non-null value
      const value = point[line.dataKey];
      if (value === null || value === undefined || value === 0) {
        return [point.year, null]; // Use null to create a break in the line
      }
      return [point.year, value];
    });
    
    return {
      type: 'line' as const,
      name: line.name,
      data: seriesData,
      color: line.color,
      lineWidth: 2,
      dashStyle: line.strokeDasharray ? ('Dash' as Highcharts.DashStyleValue) : ('Solid' as Highcharts.DashStyleValue),
      marker: {
        symbol: 'circle',
        radius: 4
      },
      opacity: line.opacity
    };
  });
  
  // Configure the Highcharts options
  const options: Highcharts.Options = {
    chart: {
      type: 'line',
      backgroundColor: 'white',
      style: {
        fontFamily: FONT_FAMILY
      }
    },
    title: {
      text: standardized ? 'Standardized Country Brand Score Comparison' : 'Country Brand Score Comparison',
      style: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    xAxis: {
      type: 'linear',
      min: minYear,
      max: maxYear,
      tickInterval: 1,
      title: {
        text: 'Year',
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
      gridLineWidth: 1,
      gridLineColor: 'rgba(52, 80, 43, 0.1)'
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
        format: standardized ? '{value:.1f}σ' : '{value:.0f}',
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
    tooltip: {
      formatter: createTooltipFormatter(FONT_FAMILY, standardized),
      shared: true,
      useHTML: true
    },
    legend: {
      itemStyle: {
        color: '#34502b',
        fontFamily: FONT_FAMILY
      }
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      line: {
        connectNulls: false, // This is the key change - don't connect over null values
      },
      series: {
        marker: {
          enabled: true
        }
      }
    },
    series
  };
  
  return (
    <div className="w-full h-[500px] mb-10">
      <div className="h-[90%]">
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </div>
      
      <CountryListDisplay countries={countries} selectedBrands={selectedBrands} />
    </div>
  );
};

export default CountryLineChartContainer;
