
import React from "react";
import Highcharts from "highcharts";
import { LineConfig } from "@/hooks/useCountryLineChart";
import { createRegularSeries, createMarketAverageSeries } from "./ChartSeriesUtils";

interface SeriesPreparationProps {
  chartData: any[];
  lines: LineConfig[];
}

export const prepareChartSeries = ({
  chartData,
  lines
}: SeriesPreparationProps): Highcharts.SeriesOptionsType[] => {
  // Create regular series
  const regularSeries = createRegularSeries(chartData, lines);
  
  // Create market average series
  const marketAverageSeries = createMarketAverageSeries(chartData, lines);
  
  // Log series information
  console.log("Regular lines:", regularSeries.length);
  console.log("Market average lines:", marketAverageSeries.length);
  if (marketAverageSeries.length > 0) {
    console.log("Market average series:", marketAverageSeries.map(s => s.name));
  } else {
    console.log("Market average series: None");
  }
  
  // Combine all series
  return [...regularSeries, ...marketAverageSeries];
};
