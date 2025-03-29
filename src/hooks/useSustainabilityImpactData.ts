
import { useState, useMemo } from 'react';
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
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityImpact', country],
    queryFn: async () => {
      if (!country) return [];
      
      const { data, error } = await supabase
        .from('SBI_purchasing_decision_industries')
        .select('*')
        .eq('country', country)
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
      
      return data as ImpactData[];
    },
    enabled: !!country,
  });
  
  // Extract unique categories and impact levels
  const categories = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map(item => item.category))].sort();
  }, [data]);
  
  const impactLevels = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map(item => item.impact_level))].sort();
  }, [data]);
  
  // Extract unique years
  const years = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...new Set(data.map(item => item.year))].sort((a, b) => a - b);
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
  
  return {
    data,
    processedData,
    categories,
    impactLevels,
    years,
    isLoading,
    error,
  };
}
