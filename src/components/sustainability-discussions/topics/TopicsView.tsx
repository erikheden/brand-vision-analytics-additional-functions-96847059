
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
  
  // Normalize country codes in the data to match the selectedCountries format
  const normalizedData = data.map(item => ({
    ...item,
    country: item.country.toUpperCase()
  }));

  // Get unique topics from the data
  const topics = [...new Set(normalizedData.map(item => item.discussion_topic))].sort();

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <TopicsBarChart
        discussionData={normalizedData}
        selectedCountries={selectedCountries.map(c => c.toUpperCase())}
        selectedYear={selectedYear}
        topics={topics}
      />
    </Card>
  );
};

export default TopicsView;
