
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
      // If no country is selected, return empty array
      if (!selectedCountry) {
        console.log("No country selected for VHO data");
        return [];
      }

      console.log(`Fetching VHO data for country: ${selectedCountry}`);
      
      // Get the full country name if we have a country code
      const fullCountryName = getFullCountryName(selectedCountry);
      console.log(`Using country name for query: ${fullCountryName}`);
      
      // Try both country code and full name formats
      let { data: codeData, error: codeError } = await supabase
        .from("SBI_VHO_2021-2024")
        .select("*")
        .eq("country", selectedCountry)
        .eq("year", 2024);

      if (codeError) {
        console.error("Error fetching VHO data with country code:", codeError);
      }
      
      // If no data found with code, try with full country name
      if (!codeData || codeData.length === 0) {
        console.log(`No data found with country code, trying full name: ${fullCountryName}`);
        const { data: nameData, error: nameError } = await supabase
          .from("SBI_VHO_2021-2024")
          .select("*")
          .eq("country", fullCountryName)
          .eq("year", 2024);

        if (nameError) {
          console.error("Error fetching VHO data with full country name:", nameError);
          throw nameError;
        }
        
        if (nameData && nameData.length > 0) {
          console.log(`Fetched ${nameData.length} VHO records for ${fullCountryName}`);
          return nameData as VHOData[];
        }
      } else {
        console.log(`Fetched ${codeData.length} VHO records for ${selectedCountry}`);
        return codeData as VHOData[];
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
              country: selectedCountry,
              priority_percentage: 0.2 + Math.random() * 0.6, // Random value between 0.2 and 0.8
              year: 2024,
              vho_area: vhoArea
            });
          }
        }
      }
      
      console.log(`Generated ${sampleData.length} sample VHO records for ${selectedCountry}`);
      
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
