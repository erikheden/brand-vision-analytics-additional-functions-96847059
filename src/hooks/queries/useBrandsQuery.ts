
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";
import { getFullCountryName } from "@/components/CountrySelect";
import { normalizeBrandName } from "@/utils/industry/brandNormalization";
import { normalizeIndustryName } from "@/utils/industry/industryNormalization";

export const useBrandsQuery = (
  selectedCountry: string | string[], 
  selectedIndustries: string[]
) => {
  return useQuery({
    queryKey: ["brands", selectedCountry, selectedIndustries],
    queryFn: async () => {
      if (!selectedCountry) return [];
      
      console.log("Fetching brands for country:", selectedCountry, "and industries:", selectedIndustries);
      
      try {
        // Handle array of countries
        const countriesToQuery = Array.isArray(selectedCountry) ? selectedCountry : [selectedCountry];
        let allBrands: BrandData[] = [];
        
        // Normalize selected industries for comparison
        const normalizedSelectedIndustries = selectedIndustries.map(industry => 
          normalizeIndustryName(industry)
        );
        
        // Query for each country
        for (const country of countriesToQuery) {
          if (!country) continue;
          
          // Get the full country name if we have a country code
          const fullCountryName = getFullCountryName(country);
          
          console.log(`Querying brands for country: code=${country}, fullName=${fullCountryName}`);
          
          // Try with country code first
          let codeQuery = supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('Brand, industry, Country, Year, Score, "Row ID"')
            .eq('Country', country)
            .not('Brand', 'is', null);
          
          if (selectedIndustries.length > 0) {
            // We need to filter industry matches later, get all brands for this country
            // Do not filter by industry in the query as we need to normalize industry names
          }
          
          let { data: codeData, error: codeError } = await codeQuery;
          
          if (codeError) {
            console.error(`Error fetching brands with country code for ${country}:`, codeError);
          }
          
          // Try with full name
          let fullNameQuery = supabase
            .from("SBI Ranking Scores 2011-2025")
            .select('Brand, industry, Country, Year, Score, "Row ID"')
            .eq('Country', fullCountryName)
            .not('Brand', 'is', null);
          
          if (selectedIndustries.length > 0) {
            // We need to filter industry matches later, get all brands for this country
            // Do not filter by industry in the query as we need to normalize industry names
          }
          
          let { data: nameData, error: nameError } = await fullNameQuery;
          
          if (nameError) {
            console.error(`Error fetching brands with full name for ${fullCountryName}:`, nameError);
          }
          
          // Add results to combined data
          allBrands = [...allBrands, ...(codeData || []), ...(nameData || [])];
        }
        
        // If industries are selected, filter the brands by normalized industry names
        if (selectedIndustries.length > 0) {
          allBrands = allBrands.filter(brandData => {
            if (!brandData.industry) return false;
            const normalizedIndustry = normalizeIndustryName(brandData.industry);
            return normalizedSelectedIndustries.includes(normalizedIndustry);
          });
        }
        
        // Special case for Airbnb in Hotels industry
        if (normalizedSelectedIndustries.includes('hotels') || 
            normalizedSelectedIndustries.includes('hotels & accommodations')) {
          // Check if Airbnb exists but wasn't included
          const hasAirbnb = allBrands.some(brand => 
            brand.Brand && normalizeBrandName(brand.Brand.toString()) === normalizeBrandName('Airbnb')
          );
          
          if (!hasAirbnb) {
            // Try to find Airbnb in the database for these countries
            const airbnbQuery = supabase
              .from("SBI Ranking Scores 2011-2025")
              .select('Brand, industry, Country, Year, Score, "Row ID"')
              .ilike('Brand', '%airbnb%');
              
            const { data: airbnbData } = await airbnbQuery;
            
            if (airbnbData && airbnbData.length > 0) {
              // Filter to only include matches for the selected countries
              const countryAirbnbData = airbnbData.filter(item => {
                if (!item.Country) return false;
                return countriesToQuery.some(country => 
                  item.Country === country || item.Country === getFullCountryName(country)
                );
              });
              
              // Add to our results
              allBrands = [...allBrands, ...countryAirbnbData];
            }
          }
        }
        
        // Deduplicate brands using normalized names
        const normalizedBrandMap = new Map<string, BrandData>();
        
        // Process each brand to find preferred versions
        allBrands.forEach(brand => {
          if (!brand.Brand) return;
          
          const normalizedName = normalizeBrandName(brand.Brand.toString());
          
          // If we haven't seen this normalized brand yet, or if this version has a capital letter
          // and the current one doesn't, update the map
          if (!normalizedBrandMap.has(normalizedName) || 
              (brand.Brand.charAt(0) === brand.Brand.charAt(0).toUpperCase() && 
               normalizedBrandMap.get(normalizedName)?.Brand?.charAt(0) !== 
               normalizedBrandMap.get(normalizedName)?.Brand?.charAt(0)?.toUpperCase())) {
            normalizedBrandMap.set(normalizedName, brand);
          }
        });
        
        // Convert back to array with preferred brand names
        const dedupedBrands = Array.from(normalizedBrandMap.values());
        
        console.log(`Fetched ${allBrands.length} brands (${dedupedBrands.length} after deduplication) for ${countriesToQuery.join(', ')}:`, 
          dedupedBrands.slice(0, 5).map(b => ({ 
            brand: b.Brand, 
            country: b.Country,
            industry: b.industry,
            normalized: b.Brand ? normalizeBrandName(b.Brand.toString()) : null,
            normalizedIndustry: b.industry ? normalizeIndustryName(b.industry.toString()) : null
          }))
        );
        
        return dedupedBrands as BrandData[];
      } catch (err) {
        console.error("Exception in brands query:", err);
        return [];
      }
    },
    enabled: !!selectedCountry
  });
};
