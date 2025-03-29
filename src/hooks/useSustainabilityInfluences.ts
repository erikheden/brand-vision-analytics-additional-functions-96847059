
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
  "SE": [
    { year: 2021, percentage: 0.35, country: "SE", english_label_short: "TV" },
    { year: 2021, percentage: 0.45, country: "SE", english_label_short: "News Media" },
    { year: 2021, percentage: 0.28, country: "SE", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.22, country: "SE", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.38, country: "SE", english_label_short: "TV" },
    { year: 2022, percentage: 0.42, country: "SE", english_label_short: "News Media" },
    { year: 2022, percentage: 0.32, country: "SE", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.25, country: "SE", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.41, country: "SE", english_label_short: "TV" },
    { year: 2023, percentage: 0.39, country: "SE", english_label_short: "News Media" },
    { year: 2023, percentage: 0.37, country: "SE", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.29, country: "SE", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.43, country: "SE", english_label_short: "TV" },
    { year: 2024, percentage: 0.36, country: "SE", english_label_short: "News Media" },
    { year: 2024, percentage: 0.44, country: "SE", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.32, country: "SE", english_label_short: "Friends & Family" }
  ],
  "NO": [
    { year: 2021, percentage: 0.32, country: "NO", english_label_short: "TV" },
    { year: 2021, percentage: 0.41, country: "NO", english_label_short: "News Media" },
    { year: 2021, percentage: 0.26, country: "NO", english_label_short: "Social Media" },
    { year: 2021, percentage: 0.21, country: "NO", english_label_short: "Friends & Family" },
    { year: 2022, percentage: 0.34, country: "NO", english_label_short: "TV" },
    { year: 2022, percentage: 0.38, country: "NO", english_label_short: "News Media" },
    { year: 2022, percentage: 0.29, country: "NO", english_label_short: "Social Media" },
    { year: 2022, percentage: 0.24, country: "NO", english_label_short: "Friends & Family" },
    { year: 2023, percentage: 0.37, country: "NO", english_label_short: "TV" },
    { year: 2023, percentage: 0.36, country: "NO", english_label_short: "News Media" },
    { year: 2023, percentage: 0.33, country: "NO", english_label_short: "Social Media" },
    { year: 2023, percentage: 0.27, country: "NO", english_label_short: "Friends & Family" },
    { year: 2024, percentage: 0.40, country: "NO", english_label_short: "TV" },
    { year: 2024, percentage: 0.33, country: "NO", english_label_short: "News Media" },
    { year: 2024, percentage: 0.38, country: "NO", english_label_short: "Social Media" },
    { year: 2024, percentage: 0.30, country: "NO", english_label_short: "Friends & Family" }
  ]
};

// Add sample data for other countries
["DK", "FI", "NL"].forEach(country => {
  sampleData[country] = sampleData["SE"].map(item => ({
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
      if (!country) {
        console.log("No country provided to useSustainabilityInfluences");
        return [];
      }
      
      // Convert country code to uppercase for consistency
      const countryCode = country.toUpperCase();
      console.log(`Fetching sustainability influences for country: ${countryCode}`);
      
      const { data, error } = await supabase
        .from('SBI_influences')
        .select('*')
        .eq('country', countryCode)
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
      
      console.log(`Raw data from database for ${countryCode}:`, data);
      
      // Map the database fields to our interface
      const mappedData = data.map(item => ({
        year: item.year,
        percentage: item.percentage,
        country: item.country,
        english_label_short: item.medium // Map 'medium' from DB to 'english_label_short' for component compatibility
      })) as InfluenceData[];
      
      console.log(`Mapped ${mappedData.length} records for country ${countryCode}`);
      
      // Log the years from the data to help debug
      if (mappedData.length > 0) {
        const years = [...new Set(mappedData.map(item => item.year))].sort((a, b) => a - b);
        console.log(`Years available in data for ${countryCode}:`, years);
        
        // Count records per year for debugging
        years.forEach(year => {
          const yearData = mappedData.filter(item => item.year === year);
          console.log(`${countryCode} - Year ${year}: ${yearData.length} records`);
        });
      }
      
      // If no data is returned from the database, use sample data
      if (mappedData.length === 0 && sampleData[countryCode]) {
        console.log(`No data found for ${countryCode} in database, using sample data`);
        return sampleData[countryCode];
      }
      
      return mappedData;
    },
    enabled: !!country,
  });
  
  // Extract unique years
  const years = data && data.length > 0 
    ? [...new Set(data.map(item => item.year))].sort((a, b) => a - b)
    : [];
  
  // Log years for debugging
  if (years.length > 0) {
    console.log(`Years extracted for charts for ${country}:`, years);
  } else {
    console.log(`No years extracted for ${country}`);
  }
  
  // Extract unique influence factors (which are stored in the 'medium' field in the database)
  const influences = data && data.length > 0
    ? [...new Set(data.map(item => item.english_label_short))].sort()
    : [];
  
  // Log influences for debugging
  if (influences.length > 0) {
    console.log(`Influences extracted for ${country}:`, influences);
  } else {
    console.log(`No influences extracted for ${country}`);
  }
  
  return {
    data,
    years,
    influences,
    isLoading,
    error
  };
}
