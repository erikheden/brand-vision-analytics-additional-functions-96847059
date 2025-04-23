
import React from 'react';
import { Card } from '@/components/ui/card';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';
import TopicsBarChart from './TopicsBarChart';
import LoadingState from '../LoadingState';
import ErrorState from '../ErrorState';

interface TopicsViewProps {
  data: DiscussionTopicData[];
  selectedCountries: string[];
  selectedYear: number;
  isLoading: boolean;
  error: Error | null;
}

const TopicsView: React.FC<TopicsViewProps> = ({
  data,
  selectedCountries,
  selectedYear,
  isLoading,
  error
}) => {
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  // Get unique topics from the data
  const topics = [...new Set(data.map(item => item.discussion_topic))].sort();

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <TopicsBarChart
        discussionData={data}
        selectedCountries={selectedCountries}
        selectedYear={selectedYear}
        topics={topics}
      />
    </Card>
  );
};

export default TopicsView;
