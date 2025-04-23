
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeData } from '@/hooks/useSustainabilityKnowledge';

export const useKnowledgeData = (selectedCountries: string[]) => {
  const { toast } = useToast();
  const [countriesData, setCountriesData] = useState<Record<string, KnowledgeData[]>>({});
  const [allYears, setAllYears] = useState<number[]>([]);
  const [allTerms, setAllTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (selectedCountries.length === 0) {
        setCountriesData({});
        setAllYears([]);
        setAllTerms([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const allData: Record<string, KnowledgeData[]> = {};
        let yearsSet = new Set<number>();
        let termsSet = new Set<string>();
        
        await Promise.all(selectedCountries.map(async (country) => {
          try {
            const { data, error } = await supabase
              .from('SBI_Knowledge')
              .select('*')
              .eq('country', country)
              .order('year', { ascending: true });
            
            if (error) throw error;
            
            allData[country] = data as KnowledgeData[];
            
            // Extract years and terms
            data.forEach(item => {
              if (typeof item.year === 'number') {
                yearsSet.add(item.year);
              }
              if (item.term) {
                termsSet.add(item.term);
              }
            });
          } catch (err) {
            console.error(`Error fetching data for ${country}:`, err);
            toast({
              title: "Error",
              description: `Failed to fetch data for ${country}`,
              variant: "destructive",
            });
          }
        }));
        
        setCountriesData(allData);
        setAllYears(Array.from(yearsSet).sort((a, b) => a - b));
        setAllTerms(Array.from(termsSet).sort());
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching knowledge data:", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [selectedCountries, toast]);

  return {
    countriesData,
    allYears,
    allTerms,
    isLoading,
    error
  };
};

