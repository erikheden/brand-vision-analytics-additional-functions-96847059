
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { getFullCountryName } from '@/components/CountrySelect';

interface TopicTrendsChartProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedTopics: string[];
}

const TopicTrendsChart: React.FC<TopicTrendsChartProps> = ({
  data,
  selectedCountries,
  selectedTopics
}) => {
  // If no topics are selected, show message
  if (selectedTopics.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">Please select at least one topic to view trends</p>
      </div>
    );
  }

  // Process data for the chart
  const processedData = React.useMemo(() => {
    const yearGroups = data.reduce((acc, item) => {
      if (!selectedTopics.includes(item.discussion_topic)) return acc;
      
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {};
      }
      
      const key = `${item.country}-${item.discussion_topic}`;
      acc[year][key] = Math.round(item.percentage * 100);
      
      return acc;
    }, {} as Record<number, Record<string, number>>);

    return Object.entries(yearGroups)
      .map(([year, values]) => ({
        year: parseInt(year),
        ...values
      }))
      .sort((a, b) => a.year - b.year);
  }, [data, selectedTopics]);

  const COLORS = ['#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', '#257179'];

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year"
            label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            domain={[0, 100]}
            label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, '']}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Legend />
          {selectedCountries.flatMap((country, countryIndex) =>
            selectedTopics.map((topic, topicIndex) => (
              <Line
                key={`${country}-${topic}`}
                type="monotone"
                dataKey={`${country}-${topic}`}
                name={`${getFullCountryName(country)} - ${topic}`}
                stroke={COLORS[(countryIndex * selectedTopics.length + topicIndex) % COLORS.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopicTrendsChart;
