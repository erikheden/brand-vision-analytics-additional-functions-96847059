
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface IndustrySelectorProps {
  industries: string[];
  selectedIndustry: string;
  setSelectedIndustry: (industry: string) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({
  industries,
  selectedIndustry,
  setSelectedIndustry
}) => {
  return (
    <div className="space-y-2">
      <Label>Select Industry</Label>
      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose an industry">
            {selectedIndustry || "Choose an industry"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {industries && industries.length > 0 ? (
            industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="loading" disabled>
              No industries available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default IndustrySelector;
