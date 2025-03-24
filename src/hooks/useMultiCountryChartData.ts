
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { fetchCountryBrandData } from "@/utils/countryComparison/fetchCountryBrandData";

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
        // For each country, get the data for the selected brands
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
