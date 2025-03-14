
import { useQueries } from "@tanstack/react-query";
import { BrandData } from "@/types/brand";
import { fetchCountryBrandData } from "@/utils/countryComparison/fetchCountryBrandData";

// Type to represent data for multiple countries
export type MultiCountryData = Record<string, BrandData[]>;

export const useMultiCountryChartData = (selectedCountries: string[], selectedBrands: string[]) => {
  const results = useQueries({
    queries: selectedCountries.map(country => ({
      queryKey: ["scores", country, selectedBrands],
      queryFn: async () => fetchCountryBrandData(country, selectedBrands),
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
