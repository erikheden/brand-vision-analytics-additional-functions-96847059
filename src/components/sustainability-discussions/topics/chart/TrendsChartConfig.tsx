
import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { createTopicTrendChartOptions } from './trendChartOptions';
import { Card } from '@/components/ui/card';

interface TrendsChartConfigProps {
  data: any[];
  selectedCountries: string[];
  selectedTopics: string[];
}

const TrendsChartConfig: React.FC<TrendsChartConfigProps> = ({
  data,
  selectedCountries,
  selectedTopics
}) => {
  const { chartData, series } = useMemo(() => {
    const allData: any[] = [];
    const seriesData: Highcharts.SeriesOptionsType[] = [];

    selectedCountries.forEach((country, countryIndex) => {
      selectedTopics.forEach((topic, topicIndex) => {
        // Filter data for this country and topic
        const topicData = data
          .filter(item => {
            const key = `${country}-${topic}`;
            return key in item;
          })
          .sort((a, b) => a.year - b.year);

        if (topicData.length > 0) {
          const colorIntensity = 0.9 - (countryIndex * 0.15) - (topicIndex * 0.05);
          const color = `rgba(52, 80, 43, ${Math.max(0.3, colorIntensity)})`;
          const dashStyle = countryIndex % 2 === 0 ? 'Solid' : 'Dash';

          seriesData.push({
            type: 'line',
            name: `${country} - ${topic}`,
            data: topicData.map(d => [d.year, d[`${country}-${topic}`]]),
            color,
            dashStyle: dashStyle as Highcharts.DashStyleValue,
          });
        }
      });
    });

    return { chartData: allData, series: seriesData };
  }, [data, selectedCountries, selectedTopics]);

  if (selectedCountries.length === 0 || selectedTopics.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Please select countries and topics to view the trends.
        </div>
      </Card>
    );
  }

  const options = createTopicTrendChartOptions(chartData, selectedTopics, selectedCountries);
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

export default TrendsChartConfig;
