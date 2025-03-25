
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { fetchAverageScores } from "@/utils/countryComparison/averageScoreUtils";

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
        
        // Also get full country names for each code
        const fullCountryNames = selectedCountries.map(getFullCountryName);
        const allCountryFormats = [...selectedCountries, ...fullCountryNames];
        
        // Fetch all data for the selected countries and brands in one query
        const { data, error } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .in("Country", allCountryFormats)
          .in("Brand", selectedBrands);
          
        if (error) {
          console.error("Error fetching multi-country data:", error);
          return null;
        }
        
        if (!data || data.length === 0) {
          console.warn("No data found for the selected countries and brands");
          return {};
        }
        
        // NEW: Fetch average scores
        const averageScores = await fetchAverageScores(allCountryFormats);
        
        // Group data by country
        for (const country of selectedCountries) {
          const fullName = getFullCountryName(country);
          
          // Filter data for this country (both code and full name)
          const countryData = data.filter(
            item => item.Country === country || item.Country === fullName
          );
          
          if (countryData.length > 0) {
            countriesData[country] = countryData;
          }
        }
        
        // Add average scores as a non-enumerable property
        Object.defineProperty(countriesData, 'averageScores', {
          value: averageScores,
          enumerable: false
        });
        
        return countriesData;
      } catch (err) {
        console.error("Exception in multi-country data fetch:", err);
        return null;
      }
    },
    enabled: selectedCountries.length > 0 && selectedBrands.length > 0
  });
};
