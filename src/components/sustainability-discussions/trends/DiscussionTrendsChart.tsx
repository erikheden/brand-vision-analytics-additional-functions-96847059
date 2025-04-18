
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { getFullCountryName } from '@/components/CountrySelect';

interface DiscussionTrendsChartProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedTopic?: string;
}

const DiscussionTrendsChart: React.FC<DiscussionTrendsChartProps> = ({
  data,
  selectedCountries,
  selectedTopic
}) => {
  const chartData = useMemo(() => {
    // Group data by year and country
    const yearGroups = data.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {};
      }
      
      // If a specific topic is selected, only use that topic's data
      if (selectedTopic && item.discussion_topic !== selectedTopic) {
        return acc;
      }
      
      // For each country, calculate the average percentage for the year
      // If a topic is selected, use its percentage directly
      if (!acc[year][item.country]) {
        acc[year][item.country] = {
          count: 0,
          total: 0
        };
      }
      
      acc[year][item.country].count++;
      acc[year][item.country].total += item.percentage;
      
      return acc;
    }, {} as Record<number, Record<string, { count: number; total: number }>>);

    // Convert the grouped data into chart format
    return Object.entries(yearGroups)
      .map(([year, countries]) => {
        const point: Record<string, any> = {
          year: parseInt(year)
        };
        
        // Calculate average for each country
        Object.entries(countries).forEach(([country, data]) => {
          point[country] = (data.total / data.count) * 100; // Convert to percentage
        });
        
        return point;
      })
      .sort((a, b) => a.year - b.year);
  }, [data, selectedTopic]);

  const COLORS = [
    '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89',
    '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2'
  ];

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No trend data available for the selected criteria.
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: 'Year', 
              position: 'insideBottomRight', 
              offset: -5 
            }}
          />
          <YAxis 
            domain={[0, 100]} 
            label={{ 
              value: 'Percentage (%)', 
              angle: -90, 
              position: 'insideLeft' 
            }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Discussion Level']}
            labelFormatter={(year) => `Year: ${year}`}
          />
          <Legend 
            formatter={(value) => getFullCountryName(value)}
          />
          
          {selectedCountries.map((country, index) => (
            <Line
              key={country}
              type="monotone"
              dataKey={country}
              name={country}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DiscussionTrendsChart;
