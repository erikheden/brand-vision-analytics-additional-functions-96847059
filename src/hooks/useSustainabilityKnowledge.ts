
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeData {
  term: string;
  percentage: number;
  year: number;
  country: string;
}

export const useSustainabilityKnowledge = (selectedCountry: string) => {
  const [years, setYears] = useState<number[]>([]);
  const [terms, setTerms] = useState<string[]>([]);

  const fetchKnowledgeData = async () => {
    console.log(`Fetching sustainability knowledge data for: ${selectedCountry}`);
    
    const { data, error } = await supabase
      .from('SBI_Knowledge')
      .select('*')
      .eq('country', selectedCountry)
      .order('year', { ascending: true });
    
    if (error) {
      console.error('Error fetching knowledge data:', error);
      throw error;
    }
    
    return data as KnowledgeData[];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityKnowledge', selectedCountry],
    queryFn: fetchKnowledgeData,
    enabled: !!selectedCountry,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Extract unique years and terms when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique years
      const uniqueYears = [...new Set(data.map(item => item.year))];
      setYears(uniqueYears.sort((a, b) => a - b));
      
      // Extract unique terms
      const uniqueTerms = [...new Set(data.map(item => item.term))];
      setTerms(uniqueTerms.sort());
      
      console.log('Years extracted:', uniqueYears);
      console.log('Terms extracted:', uniqueTerms);
    }
  }, [data]);

  return {
    data: data || [],
    years,
    terms,
    isLoading,
    error,
  };
};
