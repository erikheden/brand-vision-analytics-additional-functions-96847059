
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";

// Type to represent data for multiple countries
export type MultiCountryData = Record<string, BrandData[]>;

export const useMultiCountryChartData = (selectedCountries: string[], selectedBrands: string[]) => {
  const queryClient = useQueryClient();
  
  const results = useQueries({
    queries: selectedCountries.map(country => ({
      queryKey: ["scores", country, selectedBrands],
      queryFn: async () => {
        if (!country || selectedBrands.length === 0) return [];
        
        console.log(`Fetching chart data for country: ${country} and brands:`, selectedBrands);
        
        try {
          // Get the full country name
          const fullCountryName = getFullCountryName(country);
          
          // Query with country code
          let { data: dataWithCode, error: errorWithCode } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", country)
            .in("Brand", selectedBrands)
            .order('Year', { ascending: true });
          
          if (errorWithCode) {
            console.error("Error fetching with country code:", errorWithCode);
          }
          
          // Query with full country name
          let { data: dataWithFullName, error: errorWithFullName } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", fullCountryName)
            .in("Brand", selectedBrands)
            .order('Year', { ascending: true });
          
          if (errorWithFullName) {
            console.error("Error fetching with full country name:", errorWithFullName);
          }
          
          // Get market data for standardization purposes
          let { data: allBrandsDataWithCode } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", country)
            .order('Year', { ascending: true });
            
          let { data: allBrandsDataWithFullName } = await supabase
            .from("SBI Ranking Scores 2011-2025")
            .select("*")
            .eq("Country", fullCountryName)
            .order('Year', { ascending: true });
          
          // Store all brands data for market statistics calculation
          const allBrandsData = [
            ...(allBrandsDataWithCode || []),
            ...(allBrandsDataWithFullName || [])
          ];
          
          // Combine both result sets and remove duplicates
          const combinedData = [
            ...(dataWithCode || []), 
            ...(dataWithFullName || [])
          ];
          
          // Remove duplicates (same Brand and Year)
          const uniqueEntries = new Map();
          combinedData.forEach(entry => {
            const key = `${entry.Brand}-${entry.Year}`;
            if (!uniqueEntries.has(key) || entry.Score > uniqueEntries.get(key).Score) {
              uniqueEntries.set(key, entry);
            }
          });
          
          const finalData = Array.from(uniqueEntries.values());
          
          // Store market data for standardization
          Object.defineProperty(finalData, 'marketData', {
            value: allBrandsData,
            enumerable: false
          });
          
          // Create projected data for 2025 if needed
          const yearDataByBrand = selectedBrands.map(brand => {
            const brandEntries = finalData.filter(item => item.Brand === brand);
            const has2025 = brandEntries.some(item => item.Year === 2025);
            return { brand, has2025, brandEntries };
          });
          
          const projectedData = yearDataByBrand
            .filter(item => !item.has2025 && item.brandEntries.length > 0)
            .map(item => {
              const latestData = item.brandEntries
                .filter(entry => entry.Score !== null && entry.Score !== 0)
                .sort((a, b) => b.Year - a.Year)[0];
              
              if (latestData) {
                return {
                  ...latestData,
                  "Row ID": -1,
                  Year: 2025,
                  Score: latestData.Score,
                  Projected: true
                };
              }
              return null;
            })
            .filter(Boolean);
          
          return [...finalData, ...projectedData] as BrandData[];
        } catch (err) {
          console.error("Exception in chart data query:", err);
          return [];
        }
      },
      enabled: !!country && selectedBrands.length > 0
    }))
  });
  
  // Check if all queries are completed
  const isLoading = results.some(result => result.isLoading);
  
  // Combine data from all countries
  const allCountriesData: MultiCountryData = {};
  
  // Build the data object with country keys
  results.forEach((result, index) => {
    if (result.data && !result.isLoading) {
      allCountriesData[selectedCountries[index]] = result.data;
    }
  });
  
  return {
    data: allCountriesData,
    isLoading
  };
};
