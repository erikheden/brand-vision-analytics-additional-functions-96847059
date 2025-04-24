
import React, { useState, useEffect } from 'react';
import TopicTrendsChart from './TopicTrendsChart';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';
import TopicSelector from '../TopicSelector';
import TrendsDescription from '@/components/sustainability-shared/TrendsDescription';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';

interface TopicTrendsViewProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  isLoading: boolean;
  error: Error | null;
}

const TopicTrendsView: React.FC<TopicTrendsViewProps> = ({
  data,
  selectedCountries,
  isLoading,
  error
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Normalize country codes in the data
  const normalizedData = data.map(item => ({
    ...item,
    country: item.country.toUpperCase()
  }));
  
  // Get unique topics from the data
  const topics = [...new Set(normalizedData.map(item => item.discussion_topic))].sort();

  // Auto-select the first topic when data changes and no topics are selected
  useEffect(() => {
    if (topics.length > 0 && selectedTopics.length === 0) {
      setSelectedTopics([topics[0]]);
    }
  }, [topics, selectedTopics.length]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <TrendsDescription 
        description="Compare sustainability discussion topic trends across different countries and time periods."
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <TopicSelector
            topics={topics}
            selectedTopics={selectedTopics}
            onTopicChange={setSelectedTopics}
          />
        </div>

        <div className="md:col-span-3">
          <TopicTrendsChart
            data={normalizedData}
            selectedCountries={selectedCountries.map(c => c.toUpperCase())}
            selectedTopics={selectedTopics}
          />
        </div>
      </div>
    </div>
  );
};

export default TopicTrendsView;
