
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import DiscussionTopicsComparisonChart from './DiscussionTopicsComparisonChart';
import TopicSelector from './TopicSelector';
import { DiscussionTopicData } from '@/hooks/useDiscussionTopicsData';

interface DiscussionTopicsComparisonProps {
  selectedCountries: string[];
  discussionData: DiscussionTopicData[];
}

const DiscussionTopicsComparison: React.FC<DiscussionTopicsComparisonProps> = ({ 
  selectedCountries,
  discussionData
}) => {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Extract all unique topics from the discussion data
  const allTopics = useMemo(() => {
    const topicsSet = new Set<string>();
    
    discussionData.forEach(item => {
      if (item.discussion_topic) {
        topicsSet.add(item.discussion_topic);
      }
    });
    
    return Array.from(topicsSet).sort();
  }, [discussionData]);

  // Handle topic selection toggle
  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(current => 
      current.includes(topic)
        ? current.filter(t => t !== topic)
        : [...current, topic]
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <Card className="p-4 h-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <TopicSelector
            allTopics={allTopics}
            selectedTopics={selectedTopics}
            onTopicToggle={handleTopicToggle}
          />
        </Card>
      </div>
      
      <div className="lg:col-span-3">
        <DiscussionTopicsComparisonChart
          selectedCountries={selectedCountries}
          selectedTopics={selectedTopics}
          discussionData={discussionData}
        />
      </div>
    </div>
  );
};

export default DiscussionTopicsComparison;
