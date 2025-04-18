
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { getFullCountryName } from '@/components/CountrySelect';

interface DiscussionTrendsChartProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedTopics: string[];
}

const DiscussionTrendsChart: React.FC<DiscussionTrendsChartProps> = ({
  data,
  selectedCountries,
  selectedTopics
}) => {
  const chartData = useMemo(() => {
    // If no topics are selected, show data for all topics
    const topicsToUse = selectedTopics.length > 0 ? selectedTopics : [...new Set(data.map(item => item.discussion_topic))];
    
    // Group data by year
    const yearGroups = data.reduce((acc, item) => {
      const year = item.year;
      if (!acc[year]) {
        acc[year] = {};
      }
      
      // Skip if this topic is not one we're interested in
      if (!topicsToUse.includes(item.discussion_topic)) {
        return acc;
      }
      
      // Create a unique key for country-topic combination
      const key = `${item.country}-${item.discussion_topic}`;
      
      if (!acc[year][key]) {
        acc[year][key] = {
          count: 0,
          total: 0
        };
      }
      
      acc[year][key].count++;
      acc[year][key].total += item.percentage;
      
      return acc;
    }, {} as Record<number, Record<string, { count: number; total: number }>>);

    // Convert the grouped data into chart format
    return Object.entries(yearGroups)
      .map(([year, values]) => {
        const point: Record<string, any> = {
          year: parseInt(year)
        };
        
        // Calculate average for each country-topic combination
        Object.entries(values).forEach(([key, data]) => {
          point[key] = (data.total / data.count) * 100; // Convert to percentage
        });
        
        return point;
      })
      .sort((a, b) => a.year - b.year);
  }, [data, selectedTopics]);

  // Generate lines for each country-topic combination
  const lines = useMemo(() => {
    const result: {
      key: string;
      country: string;
      topic: string;
      color: string;
    }[] = [];
    
    // If no topics are selected, use all topics from the data
    const topicsToUse = selectedTopics.length > 0 ? selectedTopics : [...new Set(data.map(item => item.discussion_topic))];
    
    // Color palette
    const COLORS = [
      '#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89',
      '#257179', '#328a94', '#3fa3ae', '#4dbcc9', '#66c7d2',
      '#7153a2', '#8c69be', '#a784d9', '#c29ff4', '#d4b8f5'
    ];
    
    let colorIndex = 0;
    
    // Create a line for each country-topic combination
    selectedCountries.forEach(country => {
      topicsToUse.forEach(topic => {
        // Check if there's actually data for this combination
        const hasData = chartData.some(point => 
          point[`${country}-${topic}`] !== undefined
        );
        
        if (hasData) {
          result.push({
            key: `${country}-${topic}`,
            country,
            topic,
            color: COLORS[colorIndex % COLORS.length]
          });
          colorIndex++;
        }
      });
    });
    
    return result;
  }, [chartData, selectedCountries, selectedTopics, data]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No trend data available for the selected criteria.
        </div>
      </Card>
    );
  }

  // Custom tooltip to show both country and topic
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;
    
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-700">{`Year: ${label}`}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => {
            const [country, topic] = entry.name.split('-');
            return (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium">{getFullCountryName(country)}</span>
                <span className="text-xs text-gray-500">({topic})</span>
                <span className="ml-auto font-medium">{entry.value.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

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
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => {
              const [country, topic] = value.split('-');
              return `${getFullCountryName(country)} - ${topic}`;
            }}
            wrapperStyle={{ maxHeight: '100px', overflowY: 'auto' }}
          />
          
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              name={line.key}
              stroke={line.color}
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
