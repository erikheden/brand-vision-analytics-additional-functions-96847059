
import React from "react";
import { Toggle } from "@/components/ui/toggle";
import { Check, Info, Sparkles } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface StandardizedToggleProps {
  standardized: boolean;
  onToggle: (pressed: boolean) => void;
}

const StandardizedToggle = ({
  standardized,
  onToggle
}: StandardizedToggleProps) => {
  const handleToggleStandardized = (pressed: boolean) => {
    console.log("Standardized toggle pressed, new value:", pressed);
    onToggle(pressed);
  };

  return (
    <div className="flex items-center justify-end space-x-4 mb-4 py-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-[#34502b] font-medium">Standardized Scores</span>
        <div className="relative flex items-center">
          <Toggle 
            pressed={standardized} 
            onPressedChange={handleToggleStandardized} 
            aria-label="Toggle standardized scores" 
            className="border border-[#34502b]/30 relative bg-[#f0d2b0] font-semibold transition-all duration-300 hover:bg-[#e5c7a5]"
          >
            {standardized && <Check className="h-4 w-4 text-[#34502b] absolute animate-scale-in" />}
          </Toggle>
          <span className="ml-2">
            <Sparkles className="h-4 w-4 text-[#34502b] opacity-70 animate-pulse" />
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-[#34502b] transition-transform hover:scale-110" />
            </TooltipTrigger>
            <TooltipContent className="bg-white p-3 max-w-xs shadow-lg">
              <p>Standardized scores normalize the data against the <strong>official market average</strong> in each country, showing how many standard deviations each brand is above or below the market average score.</p>
              <p className="text-xs mt-1 text-[#34502b]/70">Data source: SBI Average Scores table</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default StandardizedToggle;
