
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TopicSelectorProps {
  topics: string[];
  selectedTopic: string | undefined;
  onTopicChange: (topic: string | undefined) => void;
  className?: string;
}

const TopicSelector = ({
  topics,
  selectedTopic,
  onTopicChange,
  className,
}: TopicSelectorProps) => {
  const [open, setOpen] = useState(false);

  // Ensure topics is always an array, even if it's undefined or null
  const safeTopics = Array.isArray(topics) ? topics : [];

  // Add debug log to check the topics array
  useEffect(() => {
    console.log("TopicSelector received topics:", safeTopics);
    console.log("TopicSelector selected topic:", selectedTopic);
  }, [safeTopics, selectedTopic]);

  const handleSelectTopic = (topic: string) => {
    // If selecting the same topic, clear the selection
    onTopicChange(topic === selectedTopic ? undefined : topic);
    setOpen(false);
  };

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border-[#34502b]/30 text-left font-normal"
          >
            {selectedTopic || "Select discussion topic (optional)"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search topics..." />
            <CommandList>
              <CommandEmpty>No topics found.</CommandEmpty>
              <CommandGroup>
                {safeTopics.length > 0 ? (
                  safeTopics.map((topic) => (
                    <CommandItem
                      key={topic}
                      value={topic}
                      onSelect={() => handleSelectTopic(topic)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-[#34502b]",
                        selectedTopic === topic ? "bg-[#34502b] text-white" : "opacity-50"
                      )}>
                        {selectedTopic === topic && <Check className="h-3 w-3" />}
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
