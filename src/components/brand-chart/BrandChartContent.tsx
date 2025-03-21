
import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useBrandChartOptions } from '@/hooks/useBrandChartOptions';

interface BrandChartContentProps {
  yearRange: { earliest: number; latest: number };
  series: Highcharts.SeriesOptionsType[];
  standardized: boolean;
  yearlyAverages: {year: number, average: number}[];
}

const BrandChartContent: React.FC<BrandChartContentProps> = ({
  yearRange,
  series,
  standardized,
  yearlyAverages
}) => {
  // Use our custom hook to get chart options
  const options = useBrandChartOptions({
    yearRange,
    series,
    standardized,
    yearlyAverages
  });

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  );
};

export default BrandChartContent;
