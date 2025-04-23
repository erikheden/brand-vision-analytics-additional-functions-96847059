
import React from 'react';
import { getFullCountryName } from '@/components/CountrySelect';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', '#257179'];

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
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          padding={{ left: 20, right: 20 }}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          label={{ 
            value: 'Percentage (%)', 
            angle: -90, 
            position: 'insideLeft',
            style: { fill: '#6B7280' }
          }}
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
              connectNulls
            />
          ))
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendsChartConfig;
