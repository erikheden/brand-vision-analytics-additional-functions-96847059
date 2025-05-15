
import React from 'react';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import StandardComparisonChart from '@/components/charts/StandardComparisonChart';

interface TopicsBarChartProps {
  discussionData: DiscussionTopicData[];
  selectedCountries: string[];
  selectedYear: number;
  topics: string[];
}

const TopicsBarChart: React.FC<TopicsBarChartProps> = ({
  discussionData,
  selectedCountries,
  selectedYear,
  topics
}) => {
  if (!topics || topics.length === 0) {
    return (
      <div className="flex justify-center items-center h-60">
        <p className="text-gray-500">No discussion topics available</p>
      </div>
    );
  }

  // Process data for chart format
  const processedData: Record<string, Record<string, number>> = {};
  
  // Initialize data structure for each country
  selectedCountries.forEach(country => {
    processedData[country] = {};
    
    // Initialize each topic with zero (in case some countries don't have data for some topics)
    topics.forEach(topic => {
      processedData[country][topic] = 0;
    });
    
    // Fill in actual data where available
    discussionData
      .filter(item => 
        item.country === country && 
        item.year === selectedYear &&
        topics.includes(item.discussion_topic)
      )
      .forEach(item => {
        processedData[country][item.discussion_topic] = Math.round(item.percentage * 100);
      });
  });

  // Sort topics by average percentage across countries (descending)
  const sortedTopics = [...topics].sort((a, b) => {
    const avgA = selectedCountries.reduce((sum, country) => 
      sum + (processedData[country]?.[a] || 0), 0) / selectedCountries.length;
      
    const avgB = selectedCountries.reduce((sum, country) => 
      sum + (processedData[country]?.[b] || 0), 0) / selectedCountries.length;
      
    return avgB - avgA;
  });

  return (
    <StandardComparisonChart
      title="Discussion Topics Comparison"
      categories={sortedTopics}
      data={processedData}
      selectedEntities={selectedCountries}
      year={selectedYear}
      horizontal={false}
      isPercentage={true}
      height={Math.max(400, 300 + sortedTopics.length * 15)}
      emptyMessage="Please select at least one country and topic to display data."
    />
  );
};

export default TopicsBarChart;
