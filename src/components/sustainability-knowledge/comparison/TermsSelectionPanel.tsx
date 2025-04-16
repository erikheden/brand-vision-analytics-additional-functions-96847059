
import React from 'react';

interface TermsSelectionPanelProps {
  allTerms: string[];
  selectedTerms: string[];
  onTermToggle: (term: string) => void;
}

const TermsSelectionPanel: React.FC<TermsSelectionPanelProps> = ({
  allTerms,
  selectedTerms,
  onTermToggle
}) => {
  return (
    <div className="mt-4">
      <div className="text-sm text-gray-500 mb-2">
        Select terms to compare:
      </div>
      <div className="flex flex-wrap gap-2">
        {allTerms.map(term => (
          <button
            key={term}
            onClick={() => onTermToggle(term)}
            className={`text-xs px-2 py-1 rounded ${
              selectedTerms.includes(term)
                ? 'bg-[#34502b] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TermsSelectionPanel;
