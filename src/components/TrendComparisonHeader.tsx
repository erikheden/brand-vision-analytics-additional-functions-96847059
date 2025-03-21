
import React from 'react';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TrendComparisonHeaderProps {
  comparisonYear: number;
}

const TrendComparisonHeader = ({ comparisonYear }: TrendComparisonHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-white font-medium">Selection Comparison ({comparisonYear})</h3>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-white/70 cursor-help" />
          </TooltipTrigger>
          <TooltipContent className="bg-white p-3 max-w-xs">
            <p>These widgets show how each brand's sustainability score compares to the average of your selected brands. 
            The percentage shows how much better or worse a brand performs compared to others in the current selection.
            The horizontal bar shows the actual score on a scale of 0-100, with the selection average marked by a vertical line.
            <br /><br />
            <strong>Note:</strong> Selection averages are calculated using only the brands you've selected.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TrendComparisonHeader;
