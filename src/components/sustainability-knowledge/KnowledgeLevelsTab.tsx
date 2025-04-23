
import React, { useEffect } from 'react';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import KnowledgeChart from './KnowledgeChart';
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
    dataKeys: Object.keys(data || {}),
    sampleCountry: selectedCountries[0],
    sampleData: selectedCountries[0] ? data[selectedCountries[0]]?.slice(0, 2) : [],
    selectedYear,
    years,
    selectedTerms,
    selectedCountries
  });

  // Ensure we have a valid year selected if years array changes
  useEffect(() => {
    if (years && years.length > 0 && !years.includes(selectedYear)) {
      setSelectedYear(years[years.length - 1]); // Set to most recent year
    }
  }, [years, selectedYear, setSelectedYear]);

  // Get all available terms for the selected year
  const availableTerms = React.useMemo(() => {
    const termSet = new Set<string>();
    
    // For each country, add its terms for the selected year to the set
    if (data && selectedCountries) {
      selectedCountries.forEach(country => {
        const countryData = data[country] || [];
        const yearData = countryData.filter(item => item.year === selectedYear);
        yearData.forEach(item => termSet.add(item.term));
      });
    }
    
    return Array.from(termSet).sort();
  }, [data, selectedCountries, selectedYear]);

  // Check if we have data to display
  const hasData = React.useMemo(() => {
    return selectedCountries && selectedCountries.length > 0 && 
      data && Object.keys(data).length > 0 && 
      availableTerms.length > 0;
  }, [data, selectedCountries, availableTerms]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <div>
        {!hasData ? (
          <div className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
            <div className="text-center py-10 text-gray-500">
              {selectedCountries.length === 0 
                ? "Please select at least one country"
                : "No knowledge data available for the selected countries and year"}
            </div>
          </div>
        ) : selectedCountries.length === 1 ? (
          <KnowledgeChart 
            data={data[selectedCountries[0]] || []} 
            selectedYear={selectedYear} 
            country={selectedCountries[0]} 
            selectedTerms={selectedTerms.length > 0 ? selectedTerms : availableTerms}
          />
        ) : (
          <KnowledgeComparisonBarChart
            countriesData={data}
            selectedCountries={selectedCountries}
            selectedTerms={selectedTerms.length > 0 ? selectedTerms : availableTerms.slice(0, 5)} // Show top 5 terms by default
            selectedYear={selectedYear}
          />
        )}
      </div>
    </div>
  );
};

export default KnowledgeLevelsTab;
