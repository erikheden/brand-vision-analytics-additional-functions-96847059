
import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrendComparisonHeaderProps {
  comparisonYear: number;
}

const TrendComparisonHeader = ({ comparisonYear }: TrendComparisonHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-white font-medium">Industry Comparison ({comparisonYear})</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-white/70 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="bg-white p-3 max-w-xs">
            <p>These widgets show how each brand's sustainability score compares to its industry average. 
            The percentage shows how much better or worse a brand performs compared to others in the same industry.
            The horizontal bar shows the actual score on a scale of 0-100, with the industry average marked by a vertical line.
            <br /><br />
            <strong>Note:</strong> Industry averages are calculated using <em>all</em> brands in the database for each industry, not just the selected ones.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TrendComparisonHeader;
