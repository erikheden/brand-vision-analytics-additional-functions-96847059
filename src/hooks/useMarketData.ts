
import { useQueries } from "@tanstack/react-query";
import { BrandData } from "@/types/brand";
import { fetchAllBrandsData } from "@/utils/countryComparison/marketDataUtils";
import { getFullCountryName } from "@/components/CountrySelect";

export const useMarketData = (selectedCountries: string[]) => {
  const results = useQueries({
    queries: selectedCountries.map(country => ({
      queryKey: ["market-data", country],
      queryFn: async () => fetchAllBrandsData(country, getFullCountryName(country)),
      enabled: !!country
    }))
  });
  
  // Check if all queries are completed
  const isLoading = results.some(result => result.isLoading);
  
  // Combine data from all countries
  const marketData: Record<string, BrandData[]> = {};
  
  // Build the data object with country keys
  results.forEach((result, index) => {
    if (result.data && !result.isLoading) {
      marketData[selectedCountries[index]] = result.data;
    }
  });
  
  return {
    marketData: Object.keys(marketData).length > 0 ? marketData : null,
    isLoading
  };
};
