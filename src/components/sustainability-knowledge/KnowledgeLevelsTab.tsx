
import React, { useEffect } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeChart from './KnowledgeChart';
import YearSelector from '@/components/sustainability-priorities/YearSelector';
import KnowledgeComparisonBarChart from './comparison/KnowledgeComparisonBarChart';

interface KnowledgeLevelsTabProps {
  data: Record<string, KnowledgeData[]>;
  years: number[];
  selectedYear: number;
  selectedTerms: string[];
  selectedCountries: string[];
  setSelectedYear: (year: number) => void;
}

const KnowledgeLevelsTab: React.FC<KnowledgeLevelsTabProps> = ({
  data,
  years,
  selectedYear,
  selectedTerms,
  selectedCountries,
  setSelectedYear
}) => {
  // Debug log the incoming data
  console.log('KnowledgeLevelsTab props:', {
    dataKeys: Object.keys(data),
    sampleCountry: selectedCountries[0],
    sampleData: selectedCountries[0] ? data[selectedCountries[0]]?.slice(0, 2) : [],
    selectedYear,
    years,
    selectedTerms,
    selectedCountries
  });

  // Ensure we have a valid year selected if years array changes
  useEffect(() => {
    if (years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]); // Set to most recent year
    }
  }, [years, selectedYear, setSelectedYear]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <div className="space-y-4">
          <YearSelector years={years} selectedYear={selectedYear} onChange={setSelectedYear} />
        </div>
      </div>
      
      <div className="md:col-span-3">
        {selectedCountries.length === 1 ? (
          <KnowledgeChart 
            data={data[selectedCountries[0]] || []} 
            selectedYear={selectedYear} 
            country={selectedCountries[0]} 
            selectedTerms={selectedTerms} 
          />
        ) : (
          <KnowledgeComparisonBarChart
            countriesData={data}
            selectedCountries={selectedCountries}
            selectedTerms={selectedTerms}
            selectedYear={selectedYear}
          />
        )}
      </div>
    </div>
  );
};

export default KnowledgeLevelsTab;
