
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getFullCountryName } from "@/components/CountrySelect";
import { useToast } from "@/components/ui/use-toast";

export interface VHOData {
  row_id: number;
  type_of_factor: string;
  category: string;
  industry: string;
  country: string;
  priority_percentage: number;
  year: number;
  vho_area: string;
}

export const useVHOData = (selectedCountry: string) => {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: ["vhoData", selectedCountry],
    queryFn: async (): Promise<VHOData[]> => {
      if (!selectedCountry) {
        console.log("No country selected for VHO data");
        return [];
      }

      console.log(`Fetching VHO data for country: ${selectedCountry}`);
      
      const countryCode = selectedCountry.toUpperCase();
      const fullCountryName = getFullCountryName(selectedCountry);
      console.log(`Using country name for query: ${fullCountryName}`);
      
      const { data: allData, error: codeError } = await supabase
        .from("SBI_VHO_2021-2024")
        .select("*")
        .eq("country", countryCode);

      if (codeError) {
        console.error("Error fetching VHO data with country code:", codeError);
      }
      
      // If no data found with code, try with full country name
      let finalData = allData;
      if (!allData || allData.length === 0) {
        console.log(`No data found with country code, trying full name: ${fullCountryName}`);
        const { data: nameData, error: nameError } = await supabase
          .from("SBI_VHO_2021-2024")
          .select("*")
          .eq("country", fullCountryName);

        if (nameError) {
          console.error("Error fetching VHO data with full country name:", nameError);
          throw nameError;
        }
        
        finalData = nameData;
      }

      // Process the data to get only the most recent year per category
      if (finalData && finalData.length > 0) {
        console.log(`Processing ${finalData.length} VHO records`);
        
        // Group data by category
        const categoryGroups = finalData.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {} as Record<string, VHOData[]>);

        // For each category, keep only the most recent year's data
        const processedData = Object.values(categoryGroups).map(categoryData => {
          // Sort by year descending and take the first (most recent) entries
          const sortedByYear = categoryData.sort((a, b) => b.year - a.year);
          const mostRecentYear = sortedByYear[0].year;
          return sortedByYear.filter(item => item.year === mostRecentYear);
        }).flat();

        console.log(`Processed down to ${processedData.length} records after year filtering`);
        
        // Ensure priority_percentage is a number between 0 and 1
        const validatedData = processedData.map(item => {
          // If priority_percentage is greater than 1, assume it's already in percentage form (0-100)
          // and convert it to decimal form (0-1)
          const priority = item.priority_percentage > 1 ? 
            item.priority_percentage / 100 : 
            item.priority_percentage;
            
          return {
            ...item,
            priority_percentage: priority
          };
        });
        
        console.log("Sample of validated data:", validatedData.slice(0, 3));
        return validatedData;
      }

      // If no data found in the database, generate sample data for demonstration
      console.log("No VHO data found in database, generating sample data");
      
      // Generate sample VHO data for the selected country
      const sampleIndustries = [
        "Retail", 
        "Energy", 
        "Financial Services", 
        "Technology", 
        "Healthcare",
        "Manufacturing",
        "Transportation"
      ];
      
      const sampleVHOAreas = [
        "Climate Action", 
        "Circular Economy", 
        "Sustainable Supply Chain", 
        "Diversity & Inclusion", 
        "Community Impact",
        "Water Management",
        "Ethical Business Practices",
        "Biodiversity",
        "Employee Wellbeing",
        "Responsible Consumption"
      ];
      
      const sampleData: VHOData[] = [];
      
      // Generate 40 sample data points (different combinations of industries and areas)
      let id = 1;
      for (const industry of sampleIndustries) {
        // Each industry has both hygiene and more_of factors
        for (const factorType of ["hygiene_factor", "more_of"]) {
          // Each factor type covers several VHO areas
          for (let i = 0; i < 3; i++) {
            const vhoArea = sampleVHOAreas[Math.floor(Math.random() * sampleVHOAreas.length)];
            
            sampleData.push({
              row_id: id++,
              type_of_factor: factorType,
              category: industry,
              industry: industry,
              country: countryCode, // Use uppercase country code
              priority_percentage: 0.2 + Math.random() * 0.6, // Random value between 0.2 and 0.8
              year: 2024, // Always set year to 2024
              vho_area: vhoArea
            });
          }
        }
      }
      
      console.log(`Generated ${sampleData.length} sample VHO records for ${countryCode}`);
      
      // Show a toast notification to indicate we're using sample data
      toast({
        title: "Using Sample Data",
        description: "The system is currently displaying sample materiality data as no data was found in the database.",
        duration: 5000,
      });
      
      return sampleData;
    },
    enabled: !!selectedCountry,
  });
};
