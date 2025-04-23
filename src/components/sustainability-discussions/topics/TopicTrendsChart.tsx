
import React from 'react';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import { useTopicTrendsData } from '@/hooks/useTopicTrendsData';
import EmptyTopicMessage from './chart/EmptyTopicMessage';
import TrendsChartConfig from './chart/TrendsChartConfig';

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
  const processedData = useTopicTrendsData(data, selectedCountries, selectedTopics);
  
  if (selectedTopics.length === 0) {
    return <EmptyTopicMessage />;
  }

  return (
    <div className="w-full h-[500px]">
      <TrendsChartConfig
        data={processedData}
        selectedCountries={selectedCountries}
        selectedTopics={selectedTopics}
      />
    </div>
  );
};

export default TopicTrendsChart;
