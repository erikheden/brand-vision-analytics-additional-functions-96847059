
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';

interface DiscussionTopicsComparisonChartProps {
  selectedCountries: string[];
  selectedTopics: string[];
  discussionData: DiscussionTopicData[];
}

const DiscussionTopicsComparisonChart: React.FC<DiscussionTopicsComparisonChartProps> = ({
  selectedCountries,
  selectedTopics,
  discussionData
}) => {
  // Colors for the bars
  const COLORS = ['#34502b', '#4d7342', '#668c5a', '#7fa571', '#98be89', '#257179', '#328a94'];
  
  // Process the data for the chart
  const chartData = useMemo(() => {
    if (!selectedTopics.length) return [];
    
    return selectedTopics.map(topic => {
      const topicData: Record<string, any> = { topic };
      
      selectedCountries.forEach((country, index) => {
        const countryData = discussionData.find(item => 
          item.discussion_topic === topic && item.country.toUpperCase() === country.toUpperCase()
        );
        
        // Convert from decimal (0-1) to percentage (0-100) if needed
        const percentage = countryData 
          ? Math.round(countryData.percentage * 100) 
          : 0;
        
        topicData[country] = percentage;
      });
      
      return topicData;
    });
  }, [selectedTopics, selectedCountries, discussionData]);

  if (selectedTopics.length === 0) {
    return (
      <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-full flex items-center justify-center">
        <p className="text-gray-500 text-center">
          Please select at least one topic to compare across countries.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm h-full">
      <h3 className="text-lg font-medium mb-4">Discussion Topics Comparison</h3>
      
      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="topic" 
              angle={-45} 
              textAnchor="end"
              height={80} 
              interval={0}
            />
            <YAxis 
              label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} 
              domain={[0, 100]}
            />
            <Tooltip formatter={(value) => [`${value}%`, '']} />
            <Legend />
            
            {selectedCountries.map((country, index) => (
              <Bar 
                key={country} 
                dataKey={country} 
                name={country}
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default DiscussionTopicsComparisonChart;
