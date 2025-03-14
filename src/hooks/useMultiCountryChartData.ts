
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";

// Type to represent data for multiple countries
export type MultiCountryData = Record<string, BrandData[]>;

// Helper function to normalize brand names for cross-country comparison
const normalizeBrandName = (brandName: string): string => {
  if (!brandName) return '';
  // Remove any trailing country codes, clean up whitespace
  return brandName
    .trim()
    .replace(/\s+\([A-Z]{2}\)$/, '') // Remove country codes in parentheses at the end
    .replace(/\s+/g, ' '); // Normalize whitespace
};

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
          
          // For each selected brand, we need to find potential matches in the current country
          const brandQueries = selectedBrands.map(async (selectedBrand) => {
            // Normalize the selected brand name for comparison
            const normalizedSelectedBrand = normalizeBrandName(selectedBrand);
            
            // Get all brands in this country to find potential matches
            let { data: allBrandsInCountry, error: brandsError } = await supabase
              .from("SBI Ranking Scores 2011-2025")
              .select("Brand")
              .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
              .not('Brand', 'is', null)
              .order('Brand', { ascending: true });
            
            if (brandsError) {
              console.error("Error fetching brands for matching:", brandsError);
              return [];
            }
            
            // Find brands in this country that match the normalized selected brand
            const matchingBrandNames = allBrandsInCountry
              ?.map(item => item.Brand as string)
              .filter(brandName => normalizedSelectedBrand === normalizeBrandName(brandName)) || [];
            
            if (matchingBrandNames.length === 0) {
              console.log(`No matching brands found for ${selectedBrand} in ${country}`);
              return [];
            }
            
            // Query data for all matching brands
            let { data: brandData, error: dataError } = await supabase
              .from("SBI Ranking Scores 2011-2025")
              .select("*")
              .or(`Country.eq.${country},Country.eq.${fullCountryName}`)
              .in('Brand', matchingBrandNames)
              .order('Year', { ascending: true });
            
            if (dataError) {
              console.error(`Error fetching data for brand matches in ${country}:`, dataError);
              return [];
            }
            
            // Tag these records with the selected brand name for consistency
            return (brandData || []).map(item => ({
              ...item,
              OriginalBrand: item.Brand, // Keep the original brand name
              Brand: selectedBrand, // Use the selected brand name for consistency
              NormalizedBrand: normalizedSelectedBrand // For debugging
            }));
          });
          
          // Wait for all brand queries to complete
          const brandDataArrays = await Promise.all(brandQueries);
          
          // Flatten the array of arrays
          const combinedData = brandDataArrays.flat();
          
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
