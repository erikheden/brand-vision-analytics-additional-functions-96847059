import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IndustryTagsProps {
  industries: string[];
  selectedIndustry: string;
  onIndustryToggle: (industry: string) => void;
}

const IndustryTags = ({ industries, selectedIndustry, onIndustryToggle }: IndustryTagsProps) => {
  if (!industries.length) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Tag className="h-4 w-4" />
        <span>Filter by industry</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {industries.map((industry) => (
          <Button
            key={industry}
            variant="outline"
            size="sm"
            onClick={() => onIndustryToggle(industry)}
            className={`text-sm ${
              selectedIndustry === industry
                ? "bg-industry-selected hover:bg-industry-selected/90"
                : ""
            }`}
          >
            {industry}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default IndustryTags;