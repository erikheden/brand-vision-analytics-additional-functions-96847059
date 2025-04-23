
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

interface TopicSelectorProps {
  topics: string[];
  selectedTopics: string[];
  onTopicChange: (topics: string[]) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  selectedTopics,
  onTopicChange
}) => {
  const handleTopicToggle = (topic: string, checked: boolean) => {
    if (checked) {
      onTopicChange([...selectedTopics, topic]);
    } else {
      onTopicChange(selectedTopics.filter(t => t !== topic));
    }
  };

  const handleClearAll = () => {
    onTopicChange([]);
  };

  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm font-medium text-[#34502b]">
            Filter by Discussion Topics
          </Label>
          
          {selectedTopics.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs text-[#34502b]/70 hover:text-[#34502b] flex items-center gap-1"
              onClick={handleClearAll}
              type="button"
            >
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[180px] rounded-md border border-[#34502b]/20 p-2">
          <div className="space-y-2 pr-4">
            {topics.map((topic) => (
              <div key={topic} className="flex items-center space-x-2">
                <Checkbox
                  id={`topic-${topic}`}
                  checked={selectedTopics.includes(topic)}
                  onCheckedChange={(checked) => handleTopicToggle(topic, checked === true)}
                />
                <label
                  htmlFor={`topic-${topic}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {topic}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default TopicSelector;
