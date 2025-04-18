
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TopicSelectorProps {
  topics: string[];
  selectedTopics: string[];
  onTopicChange: (topics: string[]) => void;
  className?: string;
}

const TopicSelector = ({
  topics,
  selectedTopics,
  onTopicChange,
  className,
}: TopicSelectorProps) => {
  const [open, setOpen] = useState(false);

  // Ensure topics is always an array, even if it's undefined or null
  const safeTopics = Array.isArray(topics) ? topics : [];

  // Add debug log to check the topics array
  useEffect(() => {
    console.log("TopicSelector received topics:", safeTopics);
    console.log("TopicSelector selected topics:", selectedTopics);
  }, [safeTopics, selectedTopics]);

  const handleToggleTopic = (topic: string) => {
    // Check if the topic is already selected
    if (selectedTopics.includes(topic)) {
      // Remove it from selection
      onTopicChange(selectedTopics.filter(t => t !== topic));
    } else {
      // Add it to selection
      onTopicChange([...selectedTopics, topic]);
    }
  };

  const handleRemoveTopic = (topic: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the popover from closing
    onTopicChange(selectedTopics.filter(t => t !== topic));
  };

  const clearAllTopics = () => {
    onTopicChange([]);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-[#34502b]/30 text-left font-normal min-h-[40px]"
          >
            {selectedTopics.length > 0 ? (
              <div className="flex flex-wrap gap-1 max-w-[90%]">
                {selectedTopics.map(topic => (
                  <Badge 
                    key={topic} 
                    variant="outline" 
                    className="bg-[#34502b]/10 text-[#34502b] border-[#34502b]/30"
                  >
                    {topic}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={(e) => handleRemoveTopic(topic, e)}
                    />
                  </Badge>
                ))}
              </div>
            ) : (
              "Select discussion topics"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search topics..." />
            {selectedTopics.length > 0 && (
              <div className="p-2 border-b border-gray-200">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearAllTopics}
                  className="text-xs text-gray-500 hover:text-red-500"
                >
                  Clear all
                </Button>
              </div>
            )}
            <CommandList>
              <CommandEmpty>No topics found.</CommandEmpty>
              <CommandGroup>
                {safeTopics.length > 0 ? (
                  safeTopics.map((topic) => (
                    <CommandItem
                      key={topic}
                      value={topic}
                      onSelect={() => handleToggleTopic(topic)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-[#34502b]",
                        selectedTopics.includes(topic) ? "bg-[#34502b] text-white" : "opacity-50"
                      )}>
                        {selectedTopics.includes(topic) && <Check className="h-3 w-3" />}
                      </div>
                      <span>{topic}</span>
                    </CommandItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-gray-500">
                    No discussion topics available
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TopicSelector;
