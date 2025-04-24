
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { createKnowledgeTrendChartOptions } from '../charts/chartOptions/knowledgeTrendOptions';
import { Card } from '@/components/ui/card';

interface KnowledgeTrendComparisonLineChartProps {
  countriesData: Record<string, KnowledgeData[]>;
  selectedCountries: string[];
  selectedTerms: string[];
}

const KnowledgeTrendComparisonLineChart: React.FC<KnowledgeTrendComparisonLineChartProps> = ({
  countriesData,
  selectedCountries,
  selectedTerms
}) => {
  const { chartData, series } = useMemo(() => {
    const allData: any[] = [];
    const seriesData: Highcharts.SeriesOptionsType[] = [];

    selectedCountries.forEach((country, countryIndex) => {
      const countryData = countriesData[country] || [];
      selectedTerms.forEach((term, termIndex) => {
        const termData = countryData
          .filter(item => item.term === term)
          .sort((a, b) => a.year - b.year);

        if (termData.length > 0) {
          const colorIntensity = 0.9 - (countryIndex * 0.15) - (termIndex * 0.05);
          const color = `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`;
          const dashStyle = countryIndex % 2 === 0 ? 'Solid' : 'Dash';

          seriesData.push({
            type: 'line',
            name: `${country} - ${term}`,
            data: termData.map(d => [d.year, Math.round(d.percentage * 100)]),
            color,
            dashStyle: dashStyle as Highcharts.DashStyleValue,
          });
        }
      });
    });

    return { chartData: allData, series: seriesData };
  }, [countriesData, selectedCountries, selectedTerms]);

  if (selectedCountries.length === 0 || selectedTerms.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select countries and terms to view the comparison.
        </div>
      </Card>
    );
  }

  const options = createKnowledgeTrendChartOptions(chartData, selectedTerms, selectedCountries);
  options.series = series;

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <HighchartsReact 
        highcharts={Highcharts} 
        options={options}
      />
    </Card>
  );
};

export default KnowledgeTrendComparisonLineChart;
