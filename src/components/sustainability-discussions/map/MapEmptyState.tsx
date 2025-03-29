
import React from "react";
import { Card } from "@/components/ui/card";

interface MapEmptyStateProps {
  selectedTopic?: string;
  selectedYear: number;
}

const MapEmptyState: React.FC<MapEmptyStateProps> = ({ selectedTopic, selectedYear }) => {
  return (
    <Card className="p-4 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <div className="text-center p-10">
        <h3 className="text-lg font-semibold text-[#34502b]">No data available</h3>
        <p className="text-gray-600 mt-2">
          {selectedTopic 
            ? `No data found for "${selectedTopic}" in ${selectedYear}.` 
            : `No discussion topics data available for ${selectedYear}.`}
        </p>
      </div>
    </Card>
  );
};

export default MapEmptyState;
