
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface InfluenceData {
  year: number;
  percentage: number;
  country: string;
  english_label_short: string; // This represents the 'medium' field from the database
}

// Sample data to use when no database data is available
const sampleData: Record<string, InfluenceData[]> = {
  "Se": [
    { year: 2021, percentage: 0.35, country: "Se", english_label_short: "TV" },
    { year: 2021, percentage: 0.45, country: "Se", english_label_short: "News Media" },
    { year: 2021, percentage: 0.28, country: "Se", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.22, country: "Se", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.38, country: "Se", english_label_short: "TV" },
    { year: 2022, percentage: 0.42, country: "Se", english_label_short: "News Media" },
    { year: 2022, percentage: 0.32, country: "Se", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.25, country: "Se", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.41, country: "Se", english_label_short: "TV" },
    { year: 2023, percentage: 0.39, country: "Se", english_label_short: "News Media" },
    { year: 2023, percentage: 0.37, country: "Se", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.29, country: "Se", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.43, country: "Se", english_label_short: "TV" },
    { year: 2024, percentage: 0.36, country: "Se", english_label_short: "News Media" },
    { year: 2024, percentage: 0.44, country: "Se", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.32, country: "Se", english_label_short: "Friends & Family" }
  ],
  "No": [
    { year: 2021, percentage: 0.32, country: "No", english_label_short: "TV" },
    { year: 2021, percentage: 0.41, country: "No", english_label_short: "News Media" },
    { year: 2021, percentage: 0.26, country: "No", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.21, country: "No", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.34, country: "No", english_label_short: "TV" },
    { year: 2022, percentage: 0.38, country: "No", english_label_short: "News Media" },
    { year: 2022, percentage: 0.29, country: "No", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.24, country: "No", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.37, country: "No", english_label_short: "TV" },
    { year: 2023, percentage: 0.36, country: "No", english_label_short: "News Media" },
    { year: 2023, percentage: 0.33, country: "No", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.27, country: "No", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.40, country: "No", english_label_short: "TV" },
    { year: 2024, percentage: 0.33, country: "No", english_label_short: "News Media" },
    { year: 2024, percentage: 0.38, country: "No", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.30, country: "No", english_label_short: "Friends & Family" }
  ]
};

// Add sample data for other countries
["Dk", "Fi", "Nl"].forEach(country => {
  sampleData[country] = sampleData["Se"].map(item => ({
    ...item,
    country,
    percentage: item.percentage * (0.8 + Math.random() * 0.4) // Add some variation
  }));
});

export function useSustainabilityInfluences(country: string) {
  const { toast } = useToast();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sustainabilityInfluences', country],
    queryFn: async () => {
      if (!country) return [];
      
      const { data, error } = await supabase
        .from('SBI_influences')
        .select('*')
        .eq('country', country)
        .order('year', { ascending: true });
      
      if (error) {
        console.error('Error fetching sustainability influences data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load sustainability influences data',
          variant: 'destructive',
        });
        throw error;
      }
      
      // Map the database fields to our interface
      const mappedData = data.map(item => ({
        year: item.year,
        percentage: item.percentage,
        country: item.country,
        english_label_short: item.medium // Map 'medium' from DB to 'english_label_short' for component compatibility
      })) as InfluenceData[];
      
      // If no data is returned from the database, use sample data
      if (mappedData.length === 0 && sampleData[country]) {
        console.log(`No data found for ${country} in database, using sample data`);
        return sampleData[country];
      }
      
      return mappedData;
    },
    enabled: !!country,
  });
  
  // Extract unique years
  const years = data && data.length > 0 
    ? [...new Set(data.map(item => item.year))].sort((a, b) => a - b)
    : [];
  
  // Extract unique influence factors (which are stored in the 'medium' field in the database)
  const influences = data && data.length > 0
    ? [...new Set(data.map(item => item.english_label_short))].sort()
    : [];
  
  return {
    data,
    years,
    influences,
    isLoading,
    error
  };
}
