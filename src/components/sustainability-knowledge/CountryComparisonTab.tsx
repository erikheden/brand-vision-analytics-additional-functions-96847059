
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TermSelector from './TermSelector';
import KnowledgeComparisonChart from './KnowledgeComparisonChart';
import KnowledgeTrendComparisonChart from './KnowledgeTrendComparisonChart';

interface CountryComparisonTabProps {
  selectedCountries: string[];
  terms: string[];
}

const CountryComparisonTab: React.FC<CountryComparisonTabProps> = ({ 
  selectedCountries,
  terms: initialTerms
}) => {
  const { toast } = useToast();
  const [selectedTerms, setSelectedTerms] = useState<string[]>([]);
  const [viewType, setViewType] = useState<'snapshot' | 'trends'>('snapshot');
  const [allTerms, setAllTerms] = useState<string[]>(initialTerms || []);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // Fetch data for all selected countries
  const { data: countriesData, isLoading } = useQuery({
    queryKey: ['knowledgeComparison', selectedCountries],
    queryFn: async () => {
      try {
        const result: Record<string, KnowledgeData[]> = {};
        let allTermsList: string[] = [];
        
        // Fetch data for each country
        for (const country of selectedCountries) {
          const { data, error } = await supabase
            .from('SBI_Knowledge')
            .select('*')
            .eq('country', country)
            .order('year', { ascending: true });
            
          if (error) throw error;
          
          result[country] = data || [];
          
          // Collect all unique terms
          const countryTerms = [...new Set(data?.map(item => item.term) || [])];
          allTermsList = [...allTermsList, ...countryTerms];
        }
        
        // Set all unique terms
        const uniqueTerms = [...new Set(allTermsList)].sort();
        setAllTerms(uniqueTerms);
        
        // Set most recent year
        const allYears = [];
        for (const country in result) {
          allYears.push(...result[country].map(item => item.year));
        }
        if (allYears.length > 0) {
          setSelectedYear(Math.max(...allYears));
        }
        
        return result;
      } catch (error) {
        console.error('Error fetching knowledge data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load knowledge data',
          variant: 'destructive'
        });
        return {};
      }
    },
    enabled: selectedCountries.length > 0
  });

  useEffect(() => {
    // Select the first term by default if none selected
    if (allTerms.length > 0 && selectedTerms.length === 0) {
      setSelectedTerms([allTerms[0]]);
    }
  }, [allTerms, selectedTerms]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          Loading knowledge data for selected countries...
        </div>
      </Card>
    );
  }

  if (!countriesData || Object.keys(countriesData).length === 0) {
    return (
      <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
        <div className="text-center py-10 text-gray-500">
          No knowledge data available for the selected countries.
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-2 border-[#34502b]/20 rounded-xl shadow-md">
      <Tabs value={viewType} onValueChange={(v) => setViewType(v as 'snapshot' | 'trends')}>
        <TabsList className="bg-[#34502b]/10 mb-6">
          <TabsTrigger value="snapshot" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
            Snapshot View
          </TabsTrigger>
          <TabsTrigger value="trends" className="data-[state=active]:bg-[#34502b] data-[state=active]:text-white">
            Trends View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="snapshot">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Knowledge Levels Comparison</h3>
            </div>
            
            <KnowledgeComparisonChart 
              countriesData={countriesData} 
              selectedCountries={selectedCountries}
              selectedTerms={selectedTerms}
              selectedYear={selectedYear}
            />
            
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">
                Select terms to compare:
              </div>
              <div className="flex flex-wrap gap-2">
                {allTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      if (selectedTerms.includes(term)) {
                        setSelectedTerms(selectedTerms.filter(t => t !== term));
                      } else {
                        setSelectedTerms([...selectedTerms, term]);
                      }
                    }}
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
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Knowledge Trends Comparison</h3>
            </div>
            
            {selectedTerms.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Please select at least one term to view trends
              </div>
            ) : (
              <KnowledgeTrendComparisonChart 
                countriesData={countriesData} 
                selectedCountries={selectedCountries}
                selectedTerms={selectedTerms}
              />
            )}
            
            <div className="mt-4">
              <div className="text-sm text-gray-500 mb-2">
                Select terms to compare:
              </div>
              <div className="flex flex-wrap gap-2">
                {allTerms.map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      if (selectedTerms.includes(term)) {
                        setSelectedTerms(selectedTerms.filter(t => t !== term));
                      } else {
                        setSelectedTerms([...selectedTerms, term]);
                      }
                    }}
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
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CountryComparisonTab;
