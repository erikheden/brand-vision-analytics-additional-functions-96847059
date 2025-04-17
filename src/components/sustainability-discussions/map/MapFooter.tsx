
import React from "react";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface MapFooterProps {
  selectedTopic?: string;
  selectedYear: number;
  dataPointCount: number;
}

const MapFooter: React.FC<MapFooterProps> = ({ 
  selectedTopic, 
  selectedYear, 
  dataPointCount 
}) => {
  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="flex items-start gap-3">
        <div className="text-[#34502b] mt-0.5">
          <Info size={18} />
        </div>
        <div className="text-sm text-gray-600">
          <p>
            <span className="font-medium">
              {selectedTopic 
                ? `"${selectedTopic}" discussions` 
                : "Sustainability discussions"
              } in {selectedYear}
            </span>
          </p>
          <p className="mt-1">
            This map shows the geographic distribution of sustainability discussion topics. 
            {dataPointCount > 0 && ` Displaying data from ${dataPointCount} locations.`}
            Darker colors indicate higher percentages of discussion about the selected topic.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MapFooter;
