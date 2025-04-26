import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ImpactData {
  year: number;
  category: string;
  impact_level: string;
  country: string;
  percentage: number;
}

export function useSustainabilityImpactData(country: string) {
  const { toast } = useToast();
  const [cachedData, setCachedData] = useState<Record<string, ImpactData[]>>({});
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityImpact', country],
    queryFn: async () => {
      if (!country) return [];
      
      console.log("Fetching sustainability impact data for country:", country);
      
      // Make sure to use uppercase country codes for the database query
      const upperCountry = country.toUpperCase();
      
      // Check if we already have cached data for this country
      if (cachedData[upperCountry]) {
        console.log("Using cached data for country:", upperCountry);
        return cachedData[upperCountry];
      }
      
      const { data, error } = await supabase
        .from('SBI_purchasing_decision_industries')
        .select('*')
        .eq('country', upperCountry)
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching sustainability impact data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sustainability impact data',
          variant: 'destructive',
        });
        throw error;
      }
      
      console.log("Fetched data:", data ? data.length : 0, "rows");
      
      // Cache the data for this country
      setCachedData(prev => ({
        ...prev,
        [upperCountry]: data as ImpactData[]
      }));
      
      return data as ImpactData[];
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
  
  // Extract unique categories and impact levels
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];
    const uniqueCategories = [...new Set(data.map(item => item.category))].sort();
    console.log("Extracted categories:", uniqueCategories);
    return uniqueCategories;
  }, [data]);
  
  const impactLevels = useMemo(() => {
    if (!data || data.length === 0) return [];
    const uniqueLevels = [...new Set(data.map(item => item.impact_level))].sort();
    console.log("Extracted impact levels:", uniqueLevels);
    return uniqueLevels;
  }, [data]);
  
  // Extract unique years
  const years = useMemo(() => {
    if (!data || data.length === 0) return [];
    const uniqueYears = [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
    console.log("Extracted years:", uniqueYears);
    return uniqueYears;
  }, [data]);
  
  // Process data for visualization
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return {};
    
    const result: Record<string, Record<string, Record<string, number>>> = {};
    
    // Initialize data structure
    categories.forEach(category => {
      result[category] = {};
      years.forEach(year => {
        result[category][year] = {};
        impactLevels.forEach(level => {
          result[category][year][level] = 0;
        });
      });
    });
    
    // Fill in values
    data.forEach(item => {
      if (item.category && item.year && item.impact_level) {
        result[item.category][item.year][item.impact_level] = item.percentage;
      }
    });
    
    return result;
  }, [data, categories, years, impactLevels]);
  
  // Method to get data for a specific country (can be used outside of the hook)
  const getCountryData = async (specificCountry?: string) => {
    const countryToUse = specificCountry || country;
    if (!countryToUse) return { data: [], processedData: {} };
    
    const upperCountry = countryToUse.toUpperCase();
    
    try {
      // Check if we already have cached data
      if (cachedData[upperCountry]) {
        return { data: cachedData[upperCountry], processedData: processDataForCountry(cachedData[upperCountry]) };
      }
      
      // Otherwise fetch from the database
      const { data: countryData, error } = await supabase
        .from('SBI_purchasing_decision_industries')
        .select('*')
        .eq('country', upperCountry)
        .order('year', { ascending: true });
      
      if (error) {
        console.error(`Error fetching data for country ${upperCountry}:`, error);
        throw error;
      }
      
      // Cache this data
      setCachedData(prev => ({
        ...prev,
        [upperCountry]: countryData as ImpactData[]
      }));
      
      // Process the data
      const processedCountryData = processDataForCountry(countryData as ImpactData[]);
      
      return {
        data: countryData as ImpactData[],
        processedData: processedCountryData
      };
    } catch (e) {
      console.error(`Error getting data for country ${upperCountry}:`, e);
      return { data: [], processedData: {} };
    }
  };
  
  // Helper function to process data for a specific country
  const processDataForCountry = (countryData: ImpactData[]) => {
    if (!countryData || countryData.length === 0) return {};
    
    // Extract categories, levels, and years for this country data
    const countryCategories = [...new Set(countryData.map(item => item.category))].sort();
    const countryLevels = [...new Set(countryData.map(item => item.impact_level))].sort();
    const countryYears = [...new Set(countryData.map(item => item.year))].sort((a, b) => a - b);
    
    const result: Record<string, Record<string, Record<string, number>>> = {};
    
    // Initialize structure
    countryCategories.forEach(category => {
      result[category] = {};
      countryYears.forEach(year => {
        result[category][year] = {};
        countryLevels.forEach(level => {
          result[category][year][level] = 0;
        });
      });
    });
    
    // Fill in values
    countryData.forEach(item => {
      if (item.category && item.year && item.impact_level) {
        result[item.category][item.year][item.impact_level] = item.percentage;
      }
    });
    
    return result;
  };
  
  return {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
    getCountryData
  };
}
