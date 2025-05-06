
import { useMemo } from 'react';
import { InfluenceData } from '@/hooks/sustainability-influences';
import { processChartData } from '../utils/dataProcessor';
import { generateChartId } from '../utils/chartUtils';
import { generateChartOptions } from '../utils/chartOptionsGenerator';
import { Options } from 'highcharts';

export function useMultiCountryChartData(
  data: Record<string, InfluenceData[]>,
  selectedYear: number,
  countries: string[]
) {
  // Generate a stable chart ID for Highcharts
  const chartId = useMemo(() => 
    generateChartId(selectedYear, countries),
    [selectedYear, countries]
  );
  
  // Process data for chart with memoization to prevent unnecessary recalculations
  const { influenceTypes, series } = useMemo(() => {
    return processChartData(data, selectedYear, countries);
  }, [data, countries, selectedYear]);
  
  // Create chart options with memoization
  const options: Options = useMemo(() => {
    return generateChartOptions(chartId, influenceTypes, series, selectedYear);
  }, [influenceTypes, series, chartId, selectedYear]);

  return {
    chartId,
    options,
    influenceTypes,
    hasData: influenceTypes.length > 0
  };
}
