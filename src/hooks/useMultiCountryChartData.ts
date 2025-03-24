
import { useQuery } from "@tanstack/react-query";
import { BrandData } from "@/types/brand";
import { fetchCountryBrandData } from "@/utils/countryComparison/fetchCountryBrandData";
import { fetchBrandsAcrossCountries } from "@/utils/countryComparison/sqlBrandMatching";

export type MultiCountryData = Record<string, BrandData[]>;

export const useMultiCountryChartData = (
  selectedCountries: string[],
  selectedBrands: string[]
) => {
  return useQuery({
    queryKey: ["multi-country-scores", selectedCountries, selectedBrands],
    queryFn: async () => {
      if (selectedCountries.length === 0 || selectedBrands.length === 0) {
        return null;
      }
      
      console.log("Fetching multi-country data for countries:", selectedCountries);
      
      try {
        // Use the new SQL-based approach for better performance when comparing multiple countries
        if (selectedCountries.length > 1) {
          console.log("Using SQL-based approach for multi-country comparison");
          return await fetchBrandsAcrossCountries(selectedCountries, selectedBrands);
        }
        
        // For single country, use the existing approach which has more sophisticated matching
        console.log("Using existing approach for single country");
        const countriesData: MultiCountryData = {};
        
        // Process each selected country
        for (const country of selectedCountries) {
          // Fetch data for this country and the selected brands
          const countryData = await fetchCountryBrandData(country, selectedBrands);
          
          if (countryData.length > 0) {
            countriesData[country] = countryData;
          }
        }
        
        return countriesData;
      } catch (err) {
        console.error("Exception in multi-country data fetch:", err);
        return null;
      }
    },
    enabled: selectedCountries.length > 0 && selectedBrands.length > 0
  });
};
