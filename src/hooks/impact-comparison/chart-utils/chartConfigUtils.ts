
import { FONT_FAMILY } from "@/utils/constants";
import { getFullCountryName } from "@/components/CountrySelect";

/**
 * Creates common chart configuration options shared across different chart types
 */
export const createCommonChartOptions = (
  title: string,
  subtitle: string,
  activeCountries: string[]
) => {
  return {
    chart: {
      type: 'column',
      backgroundColor: 'white',
      style: { fontFamily: FONT_FAMILY }
    },
    title: {
      text: title,
      style: { color: '#34502b', fontFamily: FONT_FAMILY }
    },
    subtitle: {
      text: `Comparing ${activeCountries.length} countries`,
      style: { color: '#666', fontFamily: FONT_FAMILY }
    },
    legend: {
      enabled: true,
      itemStyle: { fontFamily: FONT_FAMILY }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y:.1f}%',
      shared: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    credits: { enabled: false }
  };
};

/**
 * Prepares series data for the chart from country-specific data
 */
export const prepareCountrySeries = (
  activeCountries: string[],
  getValue: (country: string, dataKey: string) => number
) => {
  return activeCountries.map(country => ({
    name: getFullCountryName(country),
    type: 'column' as const,
    data: [] as number[] // Will be populated by the caller
  }));
};
