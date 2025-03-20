
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeIndustryName } from "@/utils/industry/industryNormalization";
import { useMemo } from "react";

interface IndustryTagsProps {
  industries: string[];
  selectedIndustry: string;
  onIndustryToggle: (industry: string) => void;
}

const IndustryTags = ({ industries, selectedIndustry, onIndustryToggle }: IndustryTagsProps) => {
  if (!industries.length) return null;

  // Group industries by their normalized name to eliminate duplicates
  const uniqueIndustries = useMemo(() => {
    const normalizedMap = new Map<string, string>();
    
    // For each industry, add it to the map using its normalized version as the key
    industries.forEach(industry => {
      const normalizedName = normalizeIndustryName(industry);
      
      // Prefer versions with proper capitalization
      if (!normalizedMap.has(normalizedName) || 
          (industry.charAt(0) === industry.charAt(0).toUpperCase() && 
           normalizedMap.get(normalizedName)?.charAt(0) !== normalizedMap.get(normalizedName)?.charAt(0)?.toUpperCase())) {
        normalizedMap.set(normalizedName, industry);
      }
    });
    
    // Convert back to array with preferred display versions
    return Array.from(normalizedMap.values()).sort();
  }, [industries]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Tag className="h-4 w-4" />
        <span>Filter by industry</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {uniqueIndustries.map((industry) => (
          <Button
            key={industry}
            variant="outline"
            size="sm"
            onClick={() => onIndustryToggle(industry)}
            className={`text-sm ${
              normalizeIndustryName(selectedIndustry) === normalizeIndustryName(industry)
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
