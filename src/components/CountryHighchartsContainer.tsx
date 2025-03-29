
import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { LineConfig } from "@/hooks/useCountryLineChart";
import { prepareChartSeries } from "./country-chart/SeriesPreparation";
import { createCountryChartOptions } from "./country-chart/ChartOptionsUtils";

interface CountryHighchartsContainerProps {
  chartData: any[];
  lines: LineConfig[];
  yAxisDomain: [number, number];
  minYear: number;
  maxYear: number;
  standardized: boolean;
}

const CountryHighchartsContainer: React.FC<CountryHighchartsContainerProps> = ({
  chartData,
  lines,
  yAxisDomain,
  minYear,
  maxYear,
  standardized
}) => {
  // Prepare all series data
  const series = prepareChartSeries({ chartData, lines });
  
  // Configure the Highcharts options
  const options = createCountryChartOptions(
    minYear,
    maxYear,
    yAxisDomain,
    standardized,
    series
  );
  
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default CountryHighchartsContainer;
