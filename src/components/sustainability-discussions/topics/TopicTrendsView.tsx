
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import TopicTrendsChart from './TopicTrendsChart';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';
import TopicSelector from '../TopicSelector';

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

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  // Get unique topics from the data
  const topics = [...new Set(data.map(item => item.discussion_topic))].sort();

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <TopicSelector
          topics={topics}
          selectedTopics={selectedTopics}
          onTopicChange={setSelectedTopics}
        />
      </Card>

      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <TopicTrendsChart
          data={data}
          selectedCountries={selectedCountries}
          selectedTopics={selectedTopics}
        />
      </Card>
    </div>
  );
};

export default TopicTrendsView;
