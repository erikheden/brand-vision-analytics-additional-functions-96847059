
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { countryMapping, getFullCountryName } from "@/components/CountrySelect";
import { fetchAverageScores } from "@/utils/countryComparison/averageScoreUtils";
import { calculateYearStatistics } from "@/utils/statistics/yearStatistics";

export const useChartData = (selectedCountry: string, selectedBrands: string[]) => {
  return useQuery({
    queryKey: ["scores", selectedCountry, selectedBrands],
    queryFn: async () => {
      if (!selectedCountry || selectedBrands.length === 0) return [];
      
      console.log("Fetching chart data for country:", selectedCountry, "and brands:", selectedBrands);
      
      try {
        // Get the full country name if we have a country code
        const fullCountryName = getFullCountryName(selectedCountry);
        
        console.log(`Trying both country formats: code=${selectedCountry}, fullName=${fullCountryName}`);
        
        // Query with country code
        let { data: dataWithCode, error: errorWithCode } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .eq("Country", selectedCountry)
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
        
        // Fetch market data for standardization
        let { data: marketData, error: marketError } = await supabase
          .from("SBI Ranking Scores 2011-2025")
          .select("*")
          .or(`Country.eq.${selectedCountry},Country.eq.${fullCountryName}`)
          .order('Year', { ascending: true });
          
        if (marketError) {
          console.error("Error fetching market data:", marketError);
          marketData = [];
        }
        
        // Fetch average scores for standardization
        const countryFormats = [selectedCountry, fullCountryName];
        const averageScores = await fetchAverageScores(countryFormats);
        
        console.log("Average scores fetched:", 
          Array.from(averageScores.entries()).map(([country, yearMap]) => 
            `${country}: ${Array.from(yearMap.entries()).length} years`
          )
        );
        
        // Combine both result sets and remove duplicates
        const combinedData = [
          ...(dataWithCode || []), 
          ...(dataWithFullName || [])
        ];
        
        console.log("Combined selected brands data length:", combinedData.length);
        
        // Remove duplicates (same Brand and Year)
        const uniqueEntries = new Map();
        combinedData.forEach(entry => {
          const key = `${entry.Brand}-${entry.Year}`;
          if (!uniqueEntries.has(key) || entry.Score > uniqueEntries.get(key).Score) {
            uniqueEntries.set(key, entry);
          }
        });
        
        const finalData = Array.from(uniqueEntries.values());
        
        // Calculate country-year statistics for standardization
        // Using a utility function instead of a hook
        const marketDataObj = { [selectedCountry]: marketData || [] };
        const countryYearStats = calculateYearStatistics(marketDataObj);
        
        // Store average scores and statistics data for standardization
        // Attach as non-enumerable properties of the array
        Object.defineProperty(finalData, 'averageScores', {
          value: averageScores,
          enumerable: false
        });
        
        Object.defineProperty(finalData, 'countryYearStats', {
          value: countryYearStats,
          enumerable: false
        });
        
        // If no data is found, return an empty array
        if (finalData.length === 0) {
          console.warn("No chart data found for the selected brands and country.");
          return [];
        }
        
        // Check if we have 2025 data for each selected brand
        const yearDataByBrand = selectedBrands.map(brand => {
          const brandEntries = finalData.filter(item => item.Brand === brand);
          const has2025 = brandEntries.some(item => item.Year === 2025);
          return { brand, has2025, brandEntries };
        });
        
        // For brands without 2025 data, create projected data
        const projectedData = yearDataByBrand
          .filter(item => !item.has2025 && item.brandEntries.length > 0)
          .map(item => {
            // Get the most recent year with valid data for this brand
            const latestData = item.brandEntries
              .filter(entry => entry.Score !== null && entry.Score !== 0)
              .sort((a, b) => b.Year - a.Year)[0];
            
            if (latestData) {
              console.log(`Creating projected 2025 data for ${item.brand} based on ${latestData.Year} data`);
              // Create a projected entry for 2025
              return {
                ...latestData,
                "Row ID": -1, // Use a dummy row ID
                Year: 2025,
                Score: latestData.Score, // Using same score as latest year as projection
                Projected: true // Add flag to indicate this is projected data
              };
            }
            return null;
          })
          .filter(Boolean);
        
        // Combine actual data with any needed projections
        return [...finalData, ...projectedData] as BrandData[];
      } catch (err) {
        console.error("Exception in chart data query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry && selectedBrands.length > 0
  });
};
