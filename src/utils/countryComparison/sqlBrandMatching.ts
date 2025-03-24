
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";

/**
 * Fetches brand data across countries using SQL-based matching
 * This approach uses more database-side processing rather than application-side matching
 */
export const fetchBrandsAcrossCountries = async (
  countries: string[],
  brandNames: string[]
): Promise<Record<string, BrandData[]>> => {
  if (!countries.length || !brandNames.length) {
    return {};
  }

  console.log(`Fetching data for ${brandNames.length} brands across ${countries.length} countries using SQL approach`);
  
  try {
    // Store the results by country
    const resultsByCountry: Record<string, BrandData[]> = {};
    
    // Initialize result arrays for each country
    countries.forEach(country => {
      resultsByCountry[country] = [];
    });
    
    // Process each brand individually for better control
    for (const brandName of brandNames) {
      const normalizedBrandName = normalizeBrandName(brandName);
      
      // SQL query to find brand matches across all selected countries at once
      // This is more efficient than separate queries per country
      const { data: brandMatches, error } = await supabase
        .from("SBI Ranking Scores 2011-2025")
        .select("*")
        .in('Country', countries)
        .or(`Brand.ilike.${brandName},Brand.ilike.%${normalizedBrandName}%`)
        .order('Year', { ascending: true });
      
      if (error) {
        console.error(`Error fetching data for brand ${brandName}:`, error);
        continue;
      }
      
      if (!brandMatches || brandMatches.length === 0) {
        console.log(`No matches found for brand "${brandName}" in any country`);
        continue;
      }
      
      console.log(`Found ${brandMatches.length} records for brand "${brandName}" across countries`);
      
      // Group the matches by country
      brandMatches.forEach(match => {
        const country = match.Country;
        if (country && countries.includes(country)) {
          // Format the match data properly
          const brandData: BrandData = {
            ...match,
            Brand: brandName, // Use the selected brand name for consistency
            OriginalBrand: match.Brand, // Keep the original brand name
            matchType: "sql-match" as const
          };
          
          // Add to the appropriate country's results
          resultsByCountry[country].push(brandData);
        }
      });
    }
    
    // Fetch market averages for each country and add them to the results
    for (const country of countries) {
      const { data: marketAverages, error } = await supabase
        .from("SBI Average Scores")
        .select("*")
        .eq('country', country)
        .order('year', { ascending: true });
        
      if (error) {
        console.error(`Error fetching market averages for ${country}:`, error);
      } else if (marketAverages && marketAverages.length > 0) {
        console.log(`Found ${marketAverages.length} market average records for ${country}`);
        
        // Create market average data with the correct type
        const formattedAverages: BrandData[] = marketAverages.map(avg => ({
          "Row ID": -1 * avg.year, // Use negative IDs for average data
          Year: avg.year,
          Brand: "Market Average",
          Country: country,
          Score: avg.score,
          industry: "All Industries",
          isMarketAverage: true,
          OriginalBrand: "Market Average",
          matchType: "average" as const
        }));
        
        // Add averages to country results
        resultsByCountry[country].push(...formattedAverages);
      }
    }
    
    return resultsByCountry;
  } catch (err) {
    console.error("Exception in SQL-based brand matching:", err);
    return {};
  }
};
