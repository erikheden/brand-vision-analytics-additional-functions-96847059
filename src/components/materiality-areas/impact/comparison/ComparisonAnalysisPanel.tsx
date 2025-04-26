
import React from 'react';

interface ComparisonAnalysisPanelProps {
  viewMode: 'byCategory' | 'byImpactLevel';
}

const ComparisonAnalysisPanel: React.FC<ComparisonAnalysisPanelProps> = ({ viewMode }) => {
  return (
    <div className="p-3 bg-[#f1f0fb] rounded-md">
      <p className="text-sm text-gray-600">
        <strong>Comparison Analysis:</strong> This chart shows how 
        {viewMode === 'byCategory' 
          ? ` different countries compare across various categories for a specific impact level.`
          : ` different countries compare across impact levels for a specific category.`}
        {" "}You can see variations in sustainability impact between countries, highlighting different regional priorities and progress.
      </p>
    </div>
  );
};

export default ComparisonAnalysisPanel;
