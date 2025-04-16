
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LoadingState, EmptyState } from './comparison/ComparisonStates';
import SnapshotView from './comparison/SnapshotView';
import TrendsView from './comparison/TrendsView';

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

  const handleTermToggle = (term: string) => {
    if (selectedTerms.includes(term)) {
      setSelectedTerms(selectedTerms.filter(t => t !== term));
    } else {
      setSelectedTerms([...selectedTerms, term]);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!countriesData || Object.keys(countriesData).length === 0) {
    return <EmptyState />;
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
          <SnapshotView
            countriesData={countriesData}
            selectedCountries={selectedCountries}
            selectedTerms={selectedTerms}
            selectedYear={selectedYear}
            allTerms={allTerms}
            onTermToggle={handleTermToggle}
          />
        </TabsContent>
        
        <TabsContent value="trends">
          <TrendsView
            countriesData={countriesData}
            selectedCountries={selectedCountries}
            selectedTerms={selectedTerms}
            allTerms={allTerms}
            onTermToggle={handleTermToggle}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CountryComparisonTab;
