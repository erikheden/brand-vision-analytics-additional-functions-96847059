
import { useState, useEffect, useCallback } from 'react';
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

  const fetchData = useCallback(async (country: string) => {
    // Convert country code to uppercase for database query
    const countryCode = country.toUpperCase();
    console.log(`Fetching data for country: ${country} (using ${countryCode} for query)`);
    
    try {
      const { data, error } = await supabase
        .from('SBI_Knowledge')
        .select('*')
        .eq('country', countryCode)
        .order('year', { ascending: true });
      
      if (error) {
        console.error(`Database error for ${country}:`, error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log(`Received ${data.length} records for ${country}`);
        return data as KnowledgeData[];
      } else {
        console.log(`No data found for ${country} using ${countryCode}`);
        
        // For debugging purposes, let's query without the country filter to see if the table has any data
        const { data: debugData, error: debugError } = await supabase
          .from('SBI_Knowledge')
          .select('country')
          .limit(5);
        
        if (debugError) {
          console.error('Debug query error:', debugError);
        } else {
          console.log('Available countries in SBI_Knowledge:', debugData?.map(d => d.country));
        }
        
        return [];
      }
    } catch (err) {
      console.error(`Error fetching data for ${country}:`, err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      // If no countries selected, reset state and return
      if (!selectedCountries || selectedCountries.length === 0) {
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
        
        // Use Promise.all to fetch data for all selected countries in parallel
        const results = await Promise.all(
          selectedCountries.map(country => fetchData(country))
        );
        
        // Process results
        selectedCountries.forEach((country, index) => {
          const countryData = results[index];
          if (countryData && countryData.length > 0) {
            allData[country] = countryData;
            
            // Extract years and terms
            countryData.forEach(item => {
              if (typeof item.year === 'number') {
                yearsSet.add(item.year);
              }
              if (item.term) {
                termsSet.add(item.term);
              }
            });
          }
        });
        
        console.log(`Data fetched for ${Object.keys(allData).length} countries`);
        console.log(`Found ${yearsSet.size} unique years and ${termsSet.size} unique terms`);
        
        setCountriesData(allData);
        setAllYears(Array.from(yearsSet).sort((a, b) => a - b));
        setAllTerms(Array.from(termsSet).sort());
      } catch (err) {
        console.error("Error fetching knowledge data:", err);
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load sustainability knowledge data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [selectedCountries, fetchData, toast]);

  return {
    countriesData,
    allYears,
    allTerms,
    isLoading,
    error
  };
};
