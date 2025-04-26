
import React from "react";

interface AnalysisPanelProps {
  selectedCategories: string[];
  countryName: string;
  chartData: Array<{ value: number }>;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  selectedCategories,
  countryName,
  chartData
}) => (
  <div className="mt-4 p-3 bg-[#f1f0fb] rounded-md">
    <p className="text-sm text-gray-600">
      <strong>Analysis:</strong> The data shows how different impact levels vary across 
      {selectedCategories.length > 1 
        ? ` the ${selectedCategories.length} selected categories` 
        : ` the ${selectedCategories[0]} category`}
      in {countryName}.
      {chartData.some(item => item.value > 50) 
        ? " There is a strong impact in some areas, indicating high consumer engagement."
        : " Impact levels are moderate, suggesting potential for growth in consumer engagement."}
    </p>
  </div>
);
